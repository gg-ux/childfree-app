"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  DownloadSimple,
  ShareNetwork,
  PinterestLogo,
  InstagramLogo,
  X,
  Copy,
  Check,
  Sparkle,
} from "@phosphor-icons/react";

interface BlogPost {
  slug: string;
  title: string;
  image?: string;
}

interface SocialExportProps {
  posts: BlogPost[];
}

export function SocialExport({ posts }: SocialExportProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [originalSvg, setOriginalSvg] = useState<string | null>(null);
  const [squareSvg, setSquareSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTarget, setShareTarget] = useState<"pinterest" | "instagram" | null>(null);
  const [shareData, setShareData] = useState({
    title: "",
    description: "",
    link: "https://chosn.co",
    boardId: "",
    tags: [] as string[],
  });
  const [generatingTags, setGeneratingTags] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [copied, setCopied] = useState(false);

  // Pinterest API state
  const [pinterestConnected, setPinterestConnected] = useState(false);
  const [pinterestBoards, setPinterestBoards] = useState<{ id: string; name: string }[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [postingPin, setPostingPin] = useState(false);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);

  const selectedPost = posts.find((p) => p.slug === selectedSlug);

  // Fetch original and square SVG when post is selected
  useEffect(() => {
    if (!selectedPost?.image) {
      setOriginalSvg(null);
      setSquareSvg(null);
      return;
    }

    const fetchSvgs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch original
        const originalRes = await fetch(selectedPost.image!);
        const originalText = await originalRes.text();
        setOriginalSvg(originalText);

        // Construct square version path: /assets/blog/square/[slug].svg
        const squarePath = selectedPost.image!.replace("/assets/blog/", "/assets/blog/square/");
        const squareRes = await fetch(squarePath);

        if (squareRes.ok) {
          const squareText = await squareRes.text();
          setSquareSvg(squareText);
        } else {
          setSquareSvg(null);
          setError("Square version not found");
        }
      } catch {
        setError("Failed to load SVG");
      } finally {
        setLoading(false);
      }
    };

    fetchSvgs();
  }, [selectedPost?.image]);

  // Check Pinterest connection status
  useEffect(() => {
    const checkPinterestStatus = async () => {
      try {
        const res = await fetch("/api/admin/pinterest/status");
        const data = await res.json();
        setPinterestConnected(data.connected || false);
      } catch {
        setPinterestConnected(false);
      }
    };
    checkPinterestStatus();
  }, []);

  // Fetch Pinterest boards when connected and share modal opens
  useEffect(() => {
    const fetchBoards = async () => {
      if (!pinterestConnected || !showShareModal || shareTarget !== "pinterest") return;
      if (pinterestBoards.length > 0) return;

      setLoadingBoards(true);
      try {
        const res = await fetch("/api/admin/pinterest/boards");
        const data = await res.json();
        if (data.boards) {
          setPinterestBoards(data.boards);
        }
      } catch {
        console.error("Failed to fetch Pinterest boards");
      } finally {
        setLoadingBoards(false);
      }
    };
    fetchBoards();
  }, [pinterestConnected, showShareModal, shareTarget, pinterestBoards.length]);

  const handleDownloadPng = async () => {
    if (!previewRef.current || !squareSvg) return;

    try {
      const svgElement = previewRef.current.querySelector("svg");
      if (!svgElement) throw new Error("SVG not found");

      // Export at 2x resolution for crisp output (1600x1600)
      const exportSize = 1600;

      // Create high-res canvas
      const canvas = document.createElement("canvas");
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext("2d")!;

      // Enable high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Clone SVG and set explicit dimensions for high-res rendering
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      svgClone.setAttribute("width", String(exportSize));
      svgClone.setAttribute("height", String(exportSize));

      // Create image from SVG
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, exportSize, exportSize);
        URL.revokeObjectURL(url);

        // Download as high-quality PNG
        canvas.toBlob((blob) => {
          if (!blob) return;
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `${selectedSlug}-square.png`;
          a.click();
          URL.revokeObjectURL(downloadUrl);
        }, "image/png");
      };
      img.src = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PNG");
    }
  };

  // Generate image blob for sharing
  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!previewRef.current || !squareSvg) return null;

    return new Promise((resolve) => {
      const svgElement = previewRef.current!.querySelector("svg");
      if (!svgElement) {
        resolve(null);
        return;
      }

      const exportSize = 1600;
      const canvas = document.createElement("canvas");
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const svgClone = svgElement.cloneNode(true) as SVGElement;
      svgClone.setAttribute("width", String(exportSize));
      svgClone.setAttribute("height", String(exportSize));

      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, exportSize, exportSize);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      img.src = url;
    });
  };

  const handleShare = async (target: "pinterest" | "instagram") => {
    setShareTarget(target);
    setShowShareModal(true);
    setPinSuccess(null);

    // Generate image blob
    const blob = await generateImageBlob();
    setImageBlob(blob);

    // Pre-fill with post title
    setShareData({
      title: selectedPost?.title || "",
      description: "",
      link: `https://chosn.co/blog/${selectedSlug}`,
      boardId: "",
      tags: [],
    });
  };

  const handleGenerateTags = async () => {
    setGeneratingTags(true);
    try {
      const res = await fetch("/api/admin/generate-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote: selectedPost?.title || "", platform: shareTarget }),
      });

      const data = await res.json();
      if (res.ok) {
        setShareData((prev) => ({
          ...prev,
          description: data.description || prev.description,
          tags: data.tags || [],
        }));
      }
    } catch {
      setError("Failed to generate tags");
    } finally {
      setGeneratingTags(false);
    }
  };

  const handleCopyTags = () => {
    const tagsText = shareData.tags.map((t) => `#${t}`).join(" ");
    navigator.clipboard.writeText(tagsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadForShare = async () => {
    if (!imageBlob) return;
    const downloadUrl = URL.createObjectURL(imageBlob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${selectedSlug}-square.png`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleConnectPinterest = () => {
    window.location.href = "/api/admin/pinterest";
  };

  const handlePostToPinterest = async () => {
    if (!imageBlob || !shareData.boardId) {
      setError("Please select a board");
      return;
    }

    setPostingPin(true);
    setPinSuccess(null);
    setError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(imageBlob);
      });

      const imageBase64 = await base64Promise;

      let description = shareData.description;
      if (shareData.tags.length > 0) {
        const hashtags = shareData.tags.map((t) => `#${t}`).join(" ");
        description = description ? `${description}\n\n${hashtags}` : hashtags;
      }

      const res = await fetch("/api/admin/pinterest/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: shareData.boardId,
          title: shareData.title,
          description,
          link: shareData.link,
          imageBase64,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPinSuccess("Pin created successfully!");
        setTimeout(() => {
          setShowShareModal(false);
          setShareTarget(null);
          setPinSuccess(null);
        }, 2000);
      } else if (data.needsReauth) {
        setPinterestConnected(false);
        setError("Pinterest session expired. Please reconnect.");
      } else {
        setError(data.error || "Failed to create pin");
      }
    } catch {
      setError("Failed to post to Pinterest");
    } finally {
      setPostingPin(false);
    }
  };

  const postsWithImages = posts.filter((p) => p.image?.endsWith(".svg"));

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl md:text-2xl text-foreground">
          Social Media Export
        </h2>
        <p className="theme-body-sm text-muted mt-1">
          Convert blog images to square format for Instagram/Pinterest
        </p>
      </div>

      {/* Blog selector */}
      <div className="mb-6">
        <label className="block theme-caption text-muted mb-2">Select Blog Post</label>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 256 256'%3E%3Cpath fill='%23737373' d='M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
          }}
          className="w-full max-w-md h-10 px-4 pr-12 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest appearance-none cursor-pointer"
        >
          <option value="">Choose a post...</option>
          {postsWithImages.map((post) => (
            <option key={post.slug} value={post.slug}>
              {post.title}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 border border-coral/20 bg-coral/5 text-coral rounded-lg theme-body-sm">
          {error}
        </div>
      )}

      {/* Preview area */}
      {selectedPost && originalSvg && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original */}
          <div>
            <p className="theme-caption text-muted mb-3">Original (3:2)</p>
            <div
              className="aspect-[3/2] rounded-xl overflow-hidden bg-foreground/5 border border-border"
              dangerouslySetInnerHTML={{ __html: originalSvg }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            />
          </div>

          {/* Square preview */}
          <div>
            <p className="theme-caption text-muted mb-3">Square (1:1)</p>

            <div
              ref={previewRef}
              className="aspect-square rounded-xl overflow-hidden bg-foreground/5 border border-border flex items-center justify-center"
            >
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader size="md" />
                  <p className="theme-body-sm text-muted">Loading...</p>
                </div>
              ) : squareSvg ? (
                <div
                  dangerouslySetInnerHTML={{ __html: squareSvg }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <p className="theme-body-sm text-muted text-center px-4">
                  No square version available
                </p>
              )}
            </div>

            {/* Action buttons */}
            {squareSvg && !loading && (
              <div className="mt-4 flex gap-3">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleDownloadPng}
                  className="gap-2"
                >
                  <DownloadSimple size={14} weight="bold" />
                  Download PNG
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowShareModal(true)}
                  className="gap-2"
                >
                  <ShareNetwork size={14} weight="bold" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl text-foreground">
                  {shareTarget ? `Share to ${shareTarget === "pinterest" ? "Pinterest" : "Instagram"}` : "Share Image"}
                </h3>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setShareTarget(null);
                  }}
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  <X size={20} className="text-muted" />
                </button>
              </div>

              {/* Platform Selection */}
              {!shareTarget && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleShare("pinterest")}
                    className="p-6 border border-border rounded-xl hover:border-forest hover:bg-forest/5 transition-all flex flex-col items-center gap-3"
                  >
                    <PinterestLogo size={40} weight="fill" className="text-[#E60023]" />
                    <span className="font-medium text-foreground">Pinterest</span>
                  </button>
                  <button
                    onClick={() => handleShare("instagram")}
                    className="p-6 border border-border rounded-xl hover:border-forest hover:bg-forest/5 transition-all flex flex-col items-center gap-3"
                  >
                    <InstagramLogo size={40} weight="fill" className="text-[#E4405F]" />
                    <span className="font-medium text-foreground">Instagram</span>
                  </button>
                </div>
              )}

              {/* Pinterest Form */}
              {shareTarget === "pinterest" && (
                <div className="space-y-4">
                  {pinterestConnected ? (
                    <>
                      {/* Board Selection */}
                      <div>
                        <label className="block theme-caption text-muted mb-2">Board</label>
                        {loadingBoards ? (
                          <div className="flex items-center gap-2 text-muted">
                            <Loader size="sm" />
                            Loading boards...
                          </div>
                        ) : (
                          <select
                            value={shareData.boardId}
                            onChange={(e) => setShareData((prev) => ({ ...prev, boardId: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest"
                          >
                            <option value="">Select a board...</option>
                            {pinterestBoards.map((board) => (
                              <option key={board.id} value={board.id}>
                                {board.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block theme-caption text-muted mb-2">Title</label>
                        <input
                          type="text"
                          value={shareData.title}
                          onChange={(e) => setShareData((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest"
                          placeholder="Pin title..."
                          maxLength={100}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block theme-caption text-muted mb-2">Description</label>
                        <textarea
                          value={shareData.description}
                          onChange={(e) => setShareData((prev) => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest resize-none"
                          placeholder="Pin description..."
                          maxLength={500}
                        />
                      </div>

                      {/* Link */}
                      <div>
                        <label className="block theme-caption text-muted mb-2">Destination Link</label>
                        <input
                          type="url"
                          value={shareData.link}
                          onChange={(e) => setShareData((prev) => ({ ...prev, link: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest"
                          placeholder="https://..."
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block theme-caption text-muted">SEO Tags</label>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleGenerateTags}
                            disabled={generatingTags}
                            className="gap-2"
                          >
                            {generatingTags ? (
                              <>
                                <Loader size="sm" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkle size={14} weight="bold" />
                                Generate with AI
                              </>
                            )}
                          </Button>
                        </div>
                        {shareData.tags.length > 0 && (
                          <div className="p-3 bg-foreground/5 rounded-lg">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {shareData.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-forest/10 text-forest rounded-md text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={handleCopyTags}
                              className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                            >
                              {copied ? (
                                <>
                                  <Check size={14} />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  Copy all tags
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Success message */}
                      {pinSuccess && (
                        <div className="p-3 border border-forest/20 bg-forest/5 text-forest rounded-lg theme-body-sm flex items-center gap-2">
                          <Check size={16} weight="bold" />
                          {pinSuccess}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-border">
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={handlePostToPinterest}
                          disabled={postingPin || !shareData.boardId || !imageBlob}
                          className="gap-2"
                        >
                          {postingPin ? (
                            <>
                              <Loader size="sm" />
                              Posting...
                            </>
                          ) : (
                            <>
                              <PinterestLogo size={14} weight="bold" />
                              Post to Pinterest
                            </>
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleDownloadForShare}
                          className="gap-2"
                        >
                          <DownloadSimple size={14} weight="bold" />
                          Download
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <PinterestLogo size={48} weight="fill" className="text-[#E60023] mx-auto mb-4" />
                      <p className="theme-body-sm text-muted mb-4">
                        Connect your Pinterest account to post directly.
                      </p>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={handleConnectPinterest}
                        className="gap-2"
                      >
                        <PinterestLogo size={14} weight="bold" />
                        Connect Pinterest
                      </Button>
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="theme-caption text-muted mb-3">Or download manually:</p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleDownloadForShare}
                          className="gap-2"
                        >
                          <DownloadSimple size={14} weight="bold" />
                          Download PNG
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Instagram Form */}
              {shareTarget === "instagram" && (
                <div className="space-y-4">
                  {/* Caption */}
                  <div>
                    <label className="block theme-caption text-muted mb-2">Caption</label>
                    <textarea
                      value={shareData.description}
                      onChange={(e) => setShareData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest resize-none"
                      placeholder="Write your caption..."
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block theme-caption text-muted">Hashtags</label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleGenerateTags}
                        disabled={generatingTags}
                        className="gap-2"
                      >
                        {generatingTags ? (
                          <>
                            <Loader size="sm" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkle size={14} weight="bold" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>
                    {shareData.tags.length > 0 && (
                      <div className="p-3 bg-foreground/5 rounded-lg">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {shareData.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-forest/10 text-forest rounded-md text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={handleCopyTags}
                          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check size={14} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy all hashtags
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={handleDownloadForShare}
                      className="gap-2 flex-1"
                    >
                      <DownloadSimple size={14} weight="bold" />
                      Download for Instagram
                    </Button>
                  </div>
                  <p className="theme-caption text-muted opacity-60">
                    Download the image, then upload it to Instagram with the caption and hashtags above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
