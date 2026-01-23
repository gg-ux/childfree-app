"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  DownloadSimple,
  Sparkle,
  MagicWand,
  Heart,
  Trash,
  ShareNetwork,
  PinterestLogo,
  InstagramLogo,
  X,
  Copy,
  Check,
  ChartBar,
} from "@phosphor-icons/react";

// Color palette
const COLORS = {
  forest: "#2F7255",
  forestLight: "#4A9171",
  coral: "#D4654A",
  coralLight: "#E8907A",
  marigold: "#D9A441",
  marigoldLight: "#E8C078",
  cream: "#F5F0E8",
  navy: "#19131D",
  navyLight: "#2D2438",
};

// Layout types
const LAYOUTS = ["botanical", "geometric", "arches", "circles", "waves", "generated"] as const;
type Layout = typeof LAYOUTS[number];

// Element types for generated compositions
type GeneratedElement =
  | { type: "circle"; cx: number; cy: number; r: number; filled: boolean; opacity: number }
  | { type: "halfCircle"; cx: number; cy: number; r: number; direction: "top" | "bottom" | "left" | "right"; opacity: number }
  | { type: "arc"; x: number; y: number; width: number; strokeWidth: number; opacity: number }
  | { type: "rainbow"; x: number; y: number; size: number; opacity: number }
  | { type: "dots"; x: number; y: number; rows: number; cols: number; spacing: number; dotSize: number; opacity: number }
  | { type: "lines"; x: number; y: number; count: number; length: number; spacing: number; angle: number; opacity: number }
  | { type: "zigzag"; x: number; y: number; segments: number; amplitude: number; horizontal: boolean; opacity: number }
  | { type: "crosshatch"; x: number; y: number; size: number; opacity: number };

interface Template {
  name: string;
  bg: string;
  text: string;
  accent: string;
  accent2: string;
  layout: Layout;
  elements?: GeneratedElement[];
}

// Helper to generate random elements for a composition
const generateRandomElements = (canvasHeight: number = 800): GeneratedElement[] => {
  const elements: GeneratedElement[] = [];
  const elementCount = 2 + Math.floor(Math.random() * 3); // 2-4 elements

  const elementTypes: GeneratedElement["type"][] = [
    "circle", "halfCircle", "arc", "rainbow", "dots", "lines", "zigzag", "crosshatch"
  ];

  // Positions: corners and edges (avoid center where text goes)
  const positions = [
    { x: 80, y: 80 },    // top-left
    { x: 700, y: 80 },   // top-right
    { x: 80, y: canvasHeight - 100 },   // bottom-left
    { x: 700, y: canvasHeight - 150 },  // bottom-right
    { x: 750, y: canvasHeight / 2 },  // right-middle
    { x: 50, y: canvasHeight / 2 },   // left-middle
  ];

  const usedPositions: number[] = [];

  for (let i = 0; i < elementCount; i++) {
    // Pick unused position
    let posIndex = Math.floor(Math.random() * positions.length);
    while (usedPositions.includes(posIndex) && usedPositions.length < positions.length) {
      posIndex = Math.floor(Math.random() * positions.length);
    }
    usedPositions.push(posIndex);

    const pos = positions[posIndex];
    const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
    const opacity = 0.2 + Math.random() * 0.4; // 0.2-0.6

    switch (type) {
      case "circle":
        elements.push({
          type: "circle",
          cx: pos.x,
          cy: pos.y,
          r: 40 + Math.random() * 80,
          filled: Math.random() > 0.5,
          opacity,
        });
        break;
      case "halfCircle":
        elements.push({
          type: "halfCircle",
          cx: pos.x < 400 ? 0 : 800,
          cy: pos.y,
          r: 60 + Math.random() * 80,
          direction: pos.x < 400 ? "right" : "left",
          opacity,
        });
        break;
      case "arc":
        elements.push({
          type: "arc",
          x: pos.x,
          y: pos.y,
          width: 100 + Math.random() * 100,
          strokeWidth: 3 + Math.random() * 4,
          opacity,
        });
        break;
      case "rainbow":
        elements.push({
          type: "rainbow",
          x: pos.x - 80,
          y: pos.y,
          size: 80 + Math.random() * 60,
          opacity,
        });
        break;
      case "dots":
        elements.push({
          type: "dots",
          x: pos.x,
          y: pos.y,
          rows: 3 + Math.floor(Math.random() * 3),
          cols: 3 + Math.floor(Math.random() * 3),
          spacing: 20 + Math.random() * 15,
          dotSize: 3 + Math.random() * 3,
          opacity,
        });
        break;
      case "lines":
        elements.push({
          type: "lines",
          x: pos.x,
          y: pos.y,
          count: 3 + Math.floor(Math.random() * 4),
          length: 60 + Math.random() * 60,
          spacing: 15 + Math.random() * 10,
          angle: Math.random() > 0.5 ? 45 : -45,
          opacity,
        });
        break;
      case "zigzag":
        elements.push({
          type: "zigzag",
          x: pos.x < 400 ? 0 : 800,
          y: pos.y,
          segments: 4 + Math.floor(Math.random() * 4),
          amplitude: 30 + Math.random() * 30,
          horizontal: pos.y > canvasHeight * 0.35 && pos.y < canvasHeight * 0.65,
          opacity,
        });
        break;
      case "crosshatch":
        elements.push({
          type: "crosshatch",
          x: pos.x,
          y: pos.y,
          size: 60 + Math.random() * 40,
          opacity,
        });
        break;
    }
  }

  return elements;
};

// Helper to generate random style
const generateRandomStyle = (canvasHeight: number = 800): Template => {
  const bgColors = [COLORS.forest, COLORS.coral, COLORS.navy, COLORS.cream, COLORS.marigold];
  const accentColors = [COLORS.forest, COLORS.forestLight, COLORS.coral, COLORS.coralLight, COLORS.marigold, COLORS.marigoldLight, COLORS.cream, COLORS.navy];

  const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
  const isLightBg = bg === COLORS.cream || bg === COLORS.marigold;
  const text = isLightBg ? COLORS.navy : COLORS.cream;

  // Pick accents that contrast with background
  const validAccents = accentColors.filter(c => c !== bg && c !== text);
  const accent = validAccents[Math.floor(Math.random() * validAccents.length)];
  const accent2Options = validAccents.filter(c => c !== accent);
  const accent2 = accent2Options[Math.floor(Math.random() * accent2Options.length)];

  // 40% chance to generate a completely new composition
  const useGeneratedLayout = Math.random() < 0.4;

  if (useGeneratedLayout) {
    return {
      name: "Generated",
      bg,
      text,
      accent,
      accent2,
      layout: "generated",
      elements: generateRandomElements(canvasHeight),
    };
  }

  const layout = LAYOUTS.filter(l => l !== "generated")[Math.floor(Math.random() * (LAYOUTS.length - 1))];

  return {
    name: "Custom",
    bg,
    text,
    accent,
    accent2,
    layout,
  };
};

// Base template variations
const BASE_TEMPLATES: Template[] = [
  {
    name: "Forest",
    bg: COLORS.forest,
    text: COLORS.cream,
    accent: COLORS.marigold,
    accent2: COLORS.forestLight,
    layout: "botanical"
  },
  {
    name: "Coral",
    bg: COLORS.coral,
    text: COLORS.cream,
    accent: COLORS.cream,
    accent2: COLORS.coralLight,
    layout: "geometric"
  },
  {
    name: "Navy",
    bg: COLORS.navy,
    text: COLORS.cream,
    accent: COLORS.coral,
    accent2: COLORS.marigold,
    layout: "arches"
  },
  {
    name: "Cream",
    bg: COLORS.cream,
    text: COLORS.navy,
    accent: COLORS.forest,
    accent2: COLORS.forestLight,
    layout: "circles"
  },
  {
    name: "Marigold",
    bg: COLORS.marigold,
    text: COLORS.navy,
    accent: COLORS.forest,
    accent2: COLORS.marigoldLight,
    layout: "waves"
  },
];

export function QuoteGenerator() {
  const [quote, setQuote] = useState("Design your life. Then live it fully.");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customTemplate, setCustomTemplate] = useState<Template | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "2:3">("1:1");
  const svgRef = useRef<SVGSVGElement>(null);

  // Dimensions based on aspect ratio
  const dimensions = aspectRatio === "1:1"
    ? { width: 800, height: 800, exportWidth: 1600, exportHeight: 1600 }
    : { width: 800, height: 1200, exportWidth: 1600, exportHeight: 2400 };

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTarget, setShareTarget] = useState<"pinterest" | "instagram" | null>(null);
  const [pinterestData, setPinterestData] = useState({
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

  // Load saved templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedQuoteTemplates");
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

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
      if (pinterestBoards.length > 0) return; // Already loaded

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

  // Get current template (custom takes precedence if selected)
  const template = customTemplate || BASE_TEMPLATES[selectedTemplate];

  const handleGenerateStyle = () => {
    const newStyle = generateRandomStyle(dimensions.height);
    setCustomTemplate(newStyle);
  };

  const handleSaveStyle = () => {
    if (!customTemplate) return;
    const newSaved = [...savedTemplates, { ...customTemplate, name: `Saved ${savedTemplates.length + 1}` }];
    setSavedTemplates(newSaved);
    localStorage.setItem("savedQuoteTemplates", JSON.stringify(newSaved));
  };

  const handleDeleteSaved = (index: number) => {
    const newSaved = savedTemplates.filter((_, i) => i !== index);
    setSavedTemplates(newSaved);
    localStorage.setItem("savedQuoteTemplates", JSON.stringify(newSaved));
  };

  const handleSelectBaseTemplate = (index: number) => {
    setSelectedTemplate(index);
    setCustomTemplate(null);
  };

  const handleSelectSavedTemplate = (template: Template) => {
    setCustomTemplate(template);
  };

  const [generatingType, setGeneratingType] = useState<"manifestation" | "data" | null>(null);

  const handleGenerate = async (type: "manifestation" | "data") => {
    setGeneratingType(type);
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (res.ok) {
        setQuote(data.quote);
      } else {
        setError(data.error || "Failed to generate quote");
      }
    } catch {
      setError("Failed to generate quote");
    } finally {
      setGenerating(false);
      setGeneratingType(null);
    }
  };

  const handleDownload = async () => {
    if (!svgRef.current) return;

    try {
      const { exportWidth, exportHeight } = dimensions;

      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Clone and resize SVG
      const svgClone = svgRef.current.cloneNode(true) as SVGElement;
      svgClone.setAttribute("width", String(exportWidth));
      svgClone.setAttribute("height", String(exportHeight));

      // Serialize SVG
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, exportWidth, exportHeight);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `chosn-quote-${aspectRatio.replace(":", "x")}-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(downloadUrl);
        }, "image/png");
      };
      img.src = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download");
    }
  };

  // Generate image blob for sharing
  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!svgRef.current) return null;

    return new Promise((resolve) => {
      const { exportWidth, exportHeight } = dimensions;
      const canvas = document.createElement("canvas");
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const svgClone = svgRef.current!.cloneNode(true) as SVGElement;
      svgClone.setAttribute("width", String(exportWidth));
      svgClone.setAttribute("height", String(exportHeight));

      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, exportWidth, exportHeight);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      img.src = url;
    });
  };

  const handleShare = async (target: "pinterest" | "instagram") => {
    setShareTarget(target);
    setShowShareModal(true);

    // Generate image blob
    const blob = await generateImageBlob();
    setImageBlob(blob);

    // Pre-fill with quote text
    setPinterestData({
      title: quote.split("\n")[0] || quote.substring(0, 50),
      description: "",
      link: "https://chosn.co",
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
        body: JSON.stringify({ quote, platform: shareTarget }),
      });

      const data = await res.json();
      if (res.ok) {
        setPinterestData((prev) => ({
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
    const tagsText = pinterestData.tags.map((t) => `#${t}`).join(" ");
    navigator.clipboard.writeText(tagsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadForShare = async () => {
    if (!imageBlob) return;
    const downloadUrl = URL.createObjectURL(imageBlob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `chosn-quote-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleOpenPinterest = () => {
    // Open Pinterest create pin page
    const url = `https://www.pinterest.com/pin-builder/`;
    window.open(url, "_blank");
  };

  const handleConnectPinterest = () => {
    // Redirect to Pinterest OAuth
    window.location.href = "/api/admin/pinterest";
  };

  const handlePostToPinterest = async () => {
    if (!imageBlob || !pinterestData.boardId) {
      setError("Please select a board");
      return;
    }

    setPostingPin(true);
    setPinSuccess(null);
    setError(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1]; // Remove data URL prefix
          resolve(base64);
        };
        reader.readAsDataURL(imageBlob);
      });

      const imageBase64 = await base64Promise;

      // Add hashtags to description if present
      let description = pinterestData.description;
      if (pinterestData.tags.length > 0) {
        const hashtags = pinterestData.tags.map((t) => `#${t}`).join(" ");
        description = description ? `${description}\n\n${hashtags}` : hashtags;
      }

      const res = await fetch("/api/admin/pinterest/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: pinterestData.boardId,
          title: pinterestData.title,
          description,
          link: pinterestData.link,
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

  // Split quote into lines for better layout
  const formatQuote = (text: string) => {
    // First, respect manual line breaks
    const manualLines = text.split("\n");

    // If user has manual line breaks, use those
    if (manualLines.length > 1) {
      return manualLines.map(line => line.trim()).filter(line => line.length > 0);
    }

    // Otherwise, auto-wrap
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    // Words that make good line break points (break BEFORE these)
    const breakWords = ["with", "and", "to", "for", "in", "of", "that", "who", "where", "when"];

    words.forEach((word, index) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const isBreakWord = breakWords.includes(word.toLowerCase());
      const lineGettingLong = currentLine.length >= 15;

      // Break before connecting words if line is getting long
      if (isBreakWord && lineGettingLong && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else if (testLine.length <= 24) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    return lines;
  };

  const quoteLines = formatQuote(quote);

  return (
    <div className="mt-12 pt-12 border-t border-border">
      <div className="mb-6">
        <h2 className="font-display text-xl md:text-2xl text-foreground">
          Quote Generator
        </h2>
        <p className="theme-body-sm text-muted mt-1">
          Create shareable quotes for Instagram/Pinterest
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Quote input */}
          <div>
            <label className="block theme-caption text-muted mb-2">Quote Text</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest resize-none"
              placeholder="Enter your quote..."
            />
          </div>

          {/* Generate buttons */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleGenerate("manifestation")}
              disabled={generating}
              className="gap-2"
            >
              {generatingType === "manifestation" ? (
                <>
                  <Loader size="sm" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkle size={14} weight="bold" />
                  Generate Manifestation
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleGenerate("data")}
              disabled={generating}
              className="gap-2"
            >
              {generatingType === "data" ? (
                <>
                  <Loader size="sm" />
                  Generating...
                </>
              ) : (
                <>
                  <ChartBar size={14} weight="bold" />
                  Generate Data
                </>
              )}
            </Button>
          </div>

          {/* Template selector */}
          <div>
            <label className="block theme-caption text-muted mb-3">Style</label>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {BASE_TEMPLATES.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => handleSelectBaseTemplate(i)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      !customTemplate && selectedTemplate === i
                        ? "ring-2 ring-forest ring-offset-2"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: t.bg }}
                    title={`${t.name} (${t.layout})`}
                  />
                ))}
              </div>
              <button
                onClick={handleGenerateStyle}
                className="p-2 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
                title="Generate random style"
              >
                <MagicWand size={16} className="text-muted" />
              </button>
              {customTemplate && (
                <button
                  onClick={handleSaveStyle}
                  className="p-2 rounded-lg border border-forest bg-forest/10 hover:bg-forest/20 transition-colors"
                  title="Save this style"
                >
                  <Heart size={16} className="text-forest" />
                </button>
              )}
            </div>

            {/* Saved templates */}
            {savedTemplates.length > 0 && (
              <div className="mt-3">
                <p className="theme-caption text-muted mb-2 opacity-60">Saved styles</p>
                <div className="flex gap-2 flex-wrap">
                  {savedTemplates.map((t, i) => (
                    <div key={i} className="relative group">
                      <button
                        onClick={() => handleSelectSavedTemplate(t)}
                        className={`w-8 h-8 rounded-md transition-all ${
                          customTemplate === t
                            ? "ring-2 ring-forest ring-offset-1"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: t.bg }}
                        title={`${t.name} (${t.layout})`}
                      />
                      <button
                        onClick={() => handleDeleteSaved(i)}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash size={10} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="theme-caption text-muted mt-2 opacity-60">
              {template.name} / {template.layout}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 border border-coral/20 bg-coral/5 text-coral rounded-lg theme-body-sm">
              {error}
            </div>
          )}

          {/* Download & Share */}
          <div className="flex gap-3">
            <Button
              variant="accent"
              size="sm"
              onClick={handleDownload}
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
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="theme-caption text-muted">Preview</p>
            <div className="flex gap-1 p-1 bg-foreground/5 rounded-lg">
              <button
                onClick={() => setAspectRatio("1:1")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  aspectRatio === "1:1"
                    ? "bg-forest text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                1:1
              </button>
              <button
                onClick={() => setAspectRatio("2:3")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  aspectRatio === "2:3"
                    ? "bg-forest text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                2:3
              </button>
            </div>
          </div>
          <div
            className="rounded-xl overflow-hidden border border-border"
            style={{ aspectRatio: aspectRatio === "1:1" ? "1/1" : "2/3" }}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "100%" }}
            >
              {/* Background */}
              <rect width={dimensions.width} height={dimensions.height} fill={template.bg} />

              {/* Layout-specific decorations */}
              {template.layout === "botanical" && (
                <>
                  {/* Flowing serpentine with parallel lines */}
                  <g opacity="0.4">
                    {[0, 7, 14, 21, 28, 35, 42].map((offset) => (
                      <path
                        key={`serpent-${offset}`}
                        d={`M${-80 + offset} ${180 + offset} C${100 + offset} ${180 + offset} ${100 + offset} ${dimensions.height * 0.6 + offset} ${300 + offset} ${dimensions.height * 0.6 + offset} C${500 + offset} ${dimensions.height * 0.6 + offset} ${500 + offset} ${dimensions.height - 20 + offset} ${700 + offset} ${dimensions.height - 20 + offset}`}
                        fill="none"
                        stroke={template.accent}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    ))}
                  </g>

                  {/* Circle with offset dot grid - top right */}
                  <circle cx="720" cy="80" r="120" fill={template.accent2} opacity="0.25" />
                  <g transform="translate(600, -30)" opacity="0.55">
                    {[0, 1, 2, 3, 4, 5].map((row) =>
                      [0, 1, 2, 3, 4, 5].map((col) => (
                        <circle
                          key={`dot-${row}-${col}`}
                          cx={col * 26}
                          cy={row * 26}
                          r="4"
                          fill={template.accent}
                        />
                      ))
                    )}
                  </g>

                  {/* Half circle - bottom left */}
                  <path
                    d={`M-20 ${dimensions.height} A80 80 0 0 1 -20 ${dimensions.height - 160}`}
                    fill={template.accent}
                    opacity="0.4"
                  />
                </>
              )}

              {template.layout === "geometric" && (
                <>
                  {/* Quarter circles - corners */}
                  <path d="M0 0 L0 120 A120 120 0 0 0 120 0 Z" fill={template.accent2} opacity="0.3" />
                  <path d={`M800 ${dimensions.height} L800 ${dimensions.height - 120} A120 120 0 0 0 680 ${dimensions.height} Z`} fill={template.accent} opacity="0.4" />
                  {/* Grid of quarter circles - bottom left */}
                  <g transform={`translate(40, ${dimensions.height - 220})`}>
                    {[0, 1, 2].map((row) =>
                      [0, 1, 2].map((col) => (
                        <path
                          key={`${row}-${col}`}
                          d={`M${col * 50} ${row * 50} L${col * 50 + 50} ${row * 50} A50 50 0 0 1 ${col * 50} ${row * 50 + 50} Z`}
                          fill={(row + col) % 2 === 0 ? template.accent : template.accent2}
                          opacity="0.25"
                        />
                      ))
                    )}
                  </g>
                  {/* Diagonal lines - top right */}
                  <g stroke={template.accent} strokeWidth="2" opacity="0.2">
                    {[0, 20, 40, 60, 80].map((offset) => (
                      <line key={offset} x1={600 + offset} y1="60" x2={740 + offset} y2="200" />
                    ))}
                  </g>
                </>
              )}

              {template.layout === "arches" && (
                <>
                  {/* Rainbow arches - top right */}
                  <g transform="translate(580, 80)">
                    <path d="M0 100 A100 100 0 0 1 200 100" fill="none" stroke={template.accent2} strokeWidth="4" />
                    <path d="M18 100 A82 82 0 0 1 182 100" fill="none" stroke={template.accent} strokeWidth="4" />
                    <path d="M36 100 A64 64 0 0 1 164 100" fill="none" stroke={template.accent2} strokeWidth="4" opacity="0.6" />
                    <path d="M54 100 A46 46 0 0 1 146 100" fill="none" stroke={template.accent} strokeWidth="4" opacity="0.4" />
                  </g>
                  {/* Sine wave - horizontal from right */}
                  <path
                    d={`M820 ${dimensions.height - 180} Q780 ${dimensions.height - 200} 740 ${dimensions.height - 180} Q700 ${dimensions.height - 160} 660 ${dimensions.height - 180} Q620 ${dimensions.height - 200} 580 ${dimensions.height - 180}`}
                    fill="none"
                    stroke={template.accent}
                    strokeWidth="3"
                    opacity="0.4"
                  />
                  <path
                    d={`M820 ${dimensions.height - 140} Q780 ${dimensions.height - 160} 740 ${dimensions.height - 140} Q700 ${dimensions.height - 120} 660 ${dimensions.height - 140} Q620 ${dimensions.height - 160} 580 ${dimensions.height - 140}`}
                    fill="none"
                    stroke={template.accent2}
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  {/* Bold quarter circle - top left corner */}
                  <path
                    d="M0 0 L0 140 A140 140 0 0 0 140 0 Z"
                    fill={template.accent2}
                    opacity="0.25"
                  />
                  {/* Crossing lines - bottom left */}
                  <g transform={`translate(120, ${dimensions.height - 120})`}>
                    {[0, 45, 90, 135].map((angle) => (
                      <line
                        key={angle}
                        x1={Math.cos((angle * Math.PI) / 180) * -50}
                        y1={Math.sin((angle * Math.PI) / 180) * -50}
                        x2={Math.cos((angle * Math.PI) / 180) * 50}
                        y2={Math.sin((angle * Math.PI) / 180) * 50}
                        stroke={template.accent}
                        strokeWidth="2"
                        opacity="0.35"
                      />
                    ))}
                  </g>
                </>
              )}

              {template.layout === "circles" && (
                <>
                  {/* Concentric circles - top right */}
                  <g transform="translate(680, 100)">
                    <circle cx="0" cy="0" r="80" fill="none" stroke={template.accent} strokeWidth="3" opacity="0.3" />
                    <circle cx="0" cy="0" r="60" fill="none" stroke={template.accent2} strokeWidth="3" opacity="0.4" />
                    <circle cx="0" cy="0" r="40" fill="none" stroke={template.accent} strokeWidth="3" opacity="0.5" />
                    <circle cx="0" cy="0" r="20" fill={template.accent} opacity="0.4" />
                  </g>
                  {/* Flowing arc across middle-right */}
                  <path
                    d={`M850 ${dimensions.height * 0.375} Q650 ${dimensions.height * 0.5} 750 ${dimensions.height * 0.6875} Q850 ${dimensions.height * 0.875} 700 ${dimensions.height}`}
                    fill="none"
                    stroke={template.accent}
                    strokeWidth="3"
                    opacity="0.2"
                  />
                  {/* Half circle - top left corner */}
                  <path
                    d="M0 50 A70 70 0 0 1 70 120 L0 120 Z"
                    fill={template.accent2}
                    opacity="0.25"
                  />
                  {/* Small dot grid */}
                  <g fill={template.accent} opacity="0.2">
                    {[0, 1, 2, 3, 4].map((row) =>
                      [0, 1, 2, 3, 4].map((col) => (
                        <circle key={`${row}-${col}`} cx={620 + col * 25} cy={dimensions.height - 180 + row * 25} r="3" />
                      ))
                    )}
                  </g>
                </>
              )}

              {template.layout === "waves" && (
                <>
                  {/* Wave pattern - top */}
                  <g transform="translate(0, 80)">
                    <path
                      d="M0 40 Q50 0 100 40 Q150 80 200 40 Q250 0 300 40 Q350 80 400 40"
                      fill="none"
                      stroke={template.accent}
                      strokeWidth="3"
                      opacity="0.3"
                    />
                    <path
                      d="M0 60 Q50 20 100 60 Q150 100 200 60 Q250 20 300 60 Q350 100 400 60"
                      fill="none"
                      stroke={template.accent2}
                      strokeWidth="2"
                      opacity="0.2"
                    />
                  </g>
                  {/* Stacked half circles - bottom right */}
                  <g transform={`translate(600, ${dimensions.height - 150})`}>
                    <path d="M0 0 A60 60 0 0 1 120 0" fill="none" stroke={template.accent} strokeWidth="4" opacity="0.4" />
                    <path d="M10 20 A50 50 0 0 1 110 20" fill="none" stroke={template.accent2} strokeWidth="3" opacity="0.3" />
                    <path d="M20 40 A40 40 0 0 1 100 40" fill={template.accent} opacity="0.2" />
                  </g>
                  {/* Chevron pattern - left side */}
                  <g stroke={template.accent} strokeWidth="2" opacity="0.15">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <path key={i} d={`M30 ${dimensions.height - 200 + i * 25} L50 ${dimensions.height - 185 + i * 25} L30 ${dimensions.height - 170 + i * 25}`} fill="none" />
                    ))}
                  </g>
                </>
              )}

              {/* Generated layout - dynamic elements */}
              {template.layout === "generated" && template.elements && (
                <>
                  {template.elements.map((el, i) => {
                    const colors = [template.accent, template.accent2];
                    const color = colors[i % 2];

                    switch (el.type) {
                      case "circle":
                        return el.filled ? (
                          <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill={color} opacity={el.opacity} />
                        ) : (
                          <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill="none" stroke={color} strokeWidth="3" opacity={el.opacity} />
                        );

                      case "halfCircle":
                        const halfPath = el.direction === "right"
                          ? `M${el.cx} ${el.cy - el.r} A${el.r} ${el.r} 0 0 1 ${el.cx} ${el.cy + el.r}`
                          : el.direction === "left"
                          ? `M${el.cx} ${el.cy - el.r} A${el.r} ${el.r} 0 0 0 ${el.cx} ${el.cy + el.r}`
                          : el.direction === "top"
                          ? `M${el.cx - el.r} ${el.cy} A${el.r} ${el.r} 0 0 1 ${el.cx + el.r} ${el.cy}`
                          : `M${el.cx - el.r} ${el.cy} A${el.r} ${el.r} 0 0 0 ${el.cx + el.r} ${el.cy}`;
                        return <path key={i} d={halfPath} fill={color} opacity={el.opacity} />;

                      case "arc":
                        return (
                          <path
                            key={i}
                            d={`M${el.x} ${el.y + 50} A${el.width / 2} ${el.width / 2} 0 0 1 ${el.x + el.width} ${el.y + 50}`}
                            fill="none"
                            stroke={color}
                            strokeWidth={el.strokeWidth}
                            opacity={el.opacity}
                          />
                        );

                      case "rainbow":
                        return (
                          <g key={i} transform={`translate(${el.x}, ${el.y})`}>
                            {[0, 1, 2, 3].map((j) => (
                              <path
                                key={j}
                                d={`M${j * 15} ${el.size} A${el.size - j * 15} ${el.size - j * 15} 0 0 1 ${el.size * 2 - j * 30} ${el.size}`}
                                fill="none"
                                stroke={j % 2 === 0 ? template.accent : template.accent2}
                                strokeWidth="4"
                                opacity={el.opacity - j * 0.1}
                              />
                            ))}
                          </g>
                        );

                      case "dots":
                        return (
                          <g key={i} opacity={el.opacity}>
                            {Array.from({ length: el.rows }).map((_, row) =>
                              Array.from({ length: el.cols }).map((_, col) => (
                                <circle
                                  key={`${row}-${col}`}
                                  cx={el.x + col * el.spacing}
                                  cy={el.y + row * el.spacing}
                                  r={el.dotSize}
                                  fill={color}
                                />
                              ))
                            )}
                          </g>
                        );

                      case "lines":
                        return (
                          <g key={i} opacity={el.opacity}>
                            {Array.from({ length: el.count }).map((_, j) => {
                              const rad = (el.angle * Math.PI) / 180;
                              const x1 = el.x + j * el.spacing;
                              const y1 = el.y;
                              const x2 = x1 + Math.cos(rad) * el.length;
                              const y2 = y1 + Math.sin(rad) * el.length;
                              return <line key={j} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />;
                            })}
                          </g>
                        );

                      case "zigzag":
                        const zigPath = el.horizontal
                          ? Array.from({ length: el.segments })
                              .map((_, j) => `${j === 0 ? 'M' : 'L'}${el.x + (j % 2 === 0 ? -el.amplitude : 0)} ${el.y + j * 25}`)
                              .join(' ')
                          : Array.from({ length: el.segments })
                              .map((_, j) => `${j === 0 ? 'M' : 'L'}${el.x + j * 25} ${el.y + (j % 2 === 0 ? 0 : el.amplitude)}`)
                              .join(' ');
                        return <path key={i} d={zigPath} fill="none" stroke={color} strokeWidth="2" opacity={el.opacity} />;

                      case "crosshatch":
                        return (
                          <g key={i} transform={`translate(${el.x - el.size / 2}, ${el.y - el.size / 2})`} opacity={el.opacity}>
                            {[0, 1, 2, 3].map((j) => (
                              <line key={`h${j}`} x1={0} y1={j * (el.size / 3)} x2={el.size} y2={j * (el.size / 3)} stroke={color} strokeWidth="2" />
                            ))}
                            {[0, 1, 2, 3].map((j) => (
                              <line key={`v${j}`} x1={j * (el.size / 3)} y1={0} x2={j * (el.size / 3)} y2={el.size} stroke={color} strokeWidth="2" />
                            ))}
                          </g>
                        );

                      default:
                        return null;
                    }
                  })}
                </>
              )}

              {/* Quote text - centered vertically */}
              <g>
                {quoteLines.map((line, i) => (
                  <text
                    key={i}
                    x="80"
                    y={(dimensions.height / 2) - (quoteLines.length * 40) + i * 80}
                    fill={template.text}
                    fontFamily="Satoshi, system-ui, -apple-system, sans-serif"
                    fontSize="58"
                    fontWeight="700"
                    letterSpacing="-0.02em"
                  >
                    {line}
                  </text>
                ))}
              </g>

              {/* Branding - subtle bottom placement */}
              <g opacity="0.5">
                <text
                  x="80"
                  y={dimensions.height - 40}
                  fill={template.text}
                  fontFamily="Satoshi, system-ui, -apple-system, sans-serif"
                  fontSize="16"
                  fontWeight="500"
                  letterSpacing="0.1em"
                >
                  chosn.co
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl text-foreground">
                  {shareTarget ? `Share to ${shareTarget === "pinterest" ? "Pinterest" : "Instagram"}` : "Share Quote"}
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
                  {/* Pinterest Connection Status */}
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
                            value={pinterestData.boardId}
                            onChange={(e) => setPinterestData((prev) => ({ ...prev, boardId: e.target.value }))}
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
                          value={pinterestData.title}
                          onChange={(e) => setPinterestData((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background theme-body-sm text-foreground focus:outline-none focus:border-forest"
                          placeholder="Pin title..."
                          maxLength={100}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block theme-caption text-muted mb-2">Description</label>
                        <textarea
                          value={pinterestData.description}
                          onChange={(e) => setPinterestData((prev) => ({ ...prev, description: e.target.value }))}
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
                          value={pinterestData.link}
                          onChange={(e) => setPinterestData((prev) => ({ ...prev, link: e.target.value }))}
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
                        {pinterestData.tags.length > 0 && (
                          <div className="p-3 bg-foreground/5 rounded-lg">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {pinterestData.tags.map((tag, i) => (
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
                          disabled={postingPin || !pinterestData.boardId || !imageBlob}
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
                    /* Not connected - show connect button */
                    <div className="text-center py-6">
                      <PinterestLogo size={48} weight="fill" className="text-[#E60023] mx-auto mb-4" />
                      <p className="theme-body-sm text-muted mb-4">
                        Connect your Pinterest account to post directly from here.
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
                        <p className="theme-caption text-muted mb-3">Or share manually:</p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleDownloadForShare}
                            className="gap-2"
                          >
                            <DownloadSimple size={14} weight="bold" />
                            Download
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleOpenPinterest}
                            className="gap-2"
                          >
                            Open Pinterest
                          </Button>
                        </div>
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
                      value={pinterestData.description}
                      onChange={(e) => setPinterestData((prev) => ({ ...prev, description: e.target.value }))}
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
                    {pinterestData.tags.length > 0 && (
                      <div className="p-3 bg-foreground/5 rounded-lg">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {pinterestData.tags.map((tag, i) => (
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
