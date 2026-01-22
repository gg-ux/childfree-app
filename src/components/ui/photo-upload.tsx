"use client";

import { useState, useRef } from "react";
import { Camera, X, Plus, SpinnerGap } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

interface Photo {
  id?: string;
  url: string;
  position: number;
  isUploading?: boolean;
}

interface PhotoUploadProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  maxPhotos?: number;
  required?: boolean;
  className?: string;
}

export function PhotoUpload({
  photos,
  onChange,
  maxPhotos = 6,
  required = false,
  className,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (photos.length >= maxPhotos) {
          setError(`Maximum ${maxPhotos} photos allowed`);
          break;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("position", photos.length.toString());

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to upload");
          continue;
        }

        onChange([...photos, data.photo]);
      }
    } catch (err) {
      setError("Failed to upload photo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    // Update positions
    const reorderedPhotos = newPhotos.map((photo, i) => ({
      ...photo,
      position: i,
    }));
    onChange(reorderedPhotos);
  };

  const isSinglePhoto = maxPhotos === 1;
  const emptySlots = Math.max(0, Math.min(maxPhotos, 6) - photos.length);

  return (
    <div className={className}>
      {!isSinglePhoto && (
        <label className="block text-sm font-medium text-foreground mb-3">
          Add photos
          {required && <span className="text-coral ml-1">*</span>}
          <span className="text-muted font-medium ml-2">
            ({photos.length}/{maxPhotos})
          </span>
        </label>
      )}

      <div className={cn(
        isSinglePhoto ? "w-full max-w-[400px]" : "grid grid-cols-3 gap-3"
      )}>
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div
            key={photo.id || index}
            className={cn(
              "relative rounded-xl overflow-hidden bg-muted/20",
              isSinglePhoto ? "aspect-square" : "aspect-[3/4]",
              !isSinglePhoto && index === 0 && "col-span-2 row-span-2"
            )}
          >
            <img
              src={photo.url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={14} weight="bold" />
            </button>
            {!isSinglePhoto && index === 0 && (
              <span className="absolute bottom-2 left-2 text-xs font-medium bg-black/50 text-white px-2 py-1 rounded-full">
                Main photo
              </span>
            )}
          </div>
        ))}

        {/* Upload button */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 hover:border-forest/50 hover:bg-forest/5 transition-colors",
              isSinglePhoto ? "w-full aspect-square" : "aspect-[3/4]",
              !isSinglePhoto && photos.length === 0 && "col-span-2 row-span-2",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <SpinnerGap size={24} className="text-muted animate-spin" />
            ) : (
              <>
                <div className={cn(
                  "rounded-full bg-forest/10 flex items-center justify-center",
                  isSinglePhoto ? "w-14 h-14" : "w-10 h-10"
                )}>
                  <Plus size={isSinglePhoto ? 24 : 20} className="text-forest" weight="bold" />
                </div>
                <span className="text-sm font-[450] text-muted">
                  {isSinglePhoto ? "Choose a photo" : "Add photo"}
                </span>
              </>
            )}
          </button>
        )}

        {/* Empty slots (visual only) - only for multi-photo mode */}
        {!isSinglePhoto && photos.length > 0 &&
          Array.from({ length: Math.min(emptySlots - 1, 5 - photos.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-[3/4] rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center"
            >
              <Camera size={20} className="text-muted/30" />
            </div>
          ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple={!isSinglePhoto}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm font-[450] text-coral mt-2">{error}</p>
      )}

      {!isSinglePhoto && (
        <p className="theme-secondary mt-3">
          Tip: Your first photo will be your main profile picture.
        </p>
      )}
    </div>
  );
}
