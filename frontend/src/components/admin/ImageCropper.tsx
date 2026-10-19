"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  file: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  aspect?: number; // e.g. 16/9 or undefined for freeform
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper({ file, onCropComplete, onCancel, aspect }: ImageCropperProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedAspect, setSelectedAspect] = useState<number | undefined>(aspect);
  const imgRef = useRef<HTMLImageElement>(null);
  const [processing, setProcessing] = useState(false);

  // Load file as data URL
  useState(() => {
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(file);
  });

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    if (selectedAspect) {
      setCrop(centerAspectCrop(width, height, selectedAspect));
    } else {
      setCrop({ unit: "%", x: 5, y: 5, width: 90, height: 90 });
    }
  }, [selectedAspect]);

  const handleAspectChange = (asp: number | undefined) => {
    setSelectedAspect(asp);
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      if (asp) {
        setCrop(centerAspectCrop(naturalWidth, naturalHeight, asp));
      } else {
        setCrop({ unit: "%", x: 5, y: 5, width: 90, height: 90 });
      }
    }
  };

  const getCroppedImg = async (): Promise<File> => {
    const image = imgRef.current;
    if (!image || !completedCrop) throw new Error("No crop selected");

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Canvas empty")); return; }
        resolve(new File([blob], file.name, { type: "image/jpeg" }));
      }, "image/jpeg", 0.92);
    });
  };

  const handleDone = async () => {
    if (!completedCrop) {
      // No crop made — use original
      onCropComplete(file);
      return;
    }
    setProcessing(true);
    try {
      const cropped = await getCroppedImg();
      onCropComplete(cropped);
    } catch {
      onCropComplete(file); // fallback to original
    } finally {
      setProcessing(false);
    }
  };

  const ASPECT_OPTIONS = [
    { label: "Free", value: undefined },
    { label: "1:1", value: 1 },
    { label: "4:3", value: 4 / 3 },
    { label: "16:9", value: 16 / 9 },
    { label: "2:3", value: 2 / 3 },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <p className="text-sm font-bold text-white">Crop Image</p>
          <button onClick={onCancel} className="w-7 h-7 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-[#666] hover:text-white transition-all">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        {/* Aspect ratio picker */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest mr-2">Ratio</span>
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleAspectChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedAspect === opt.value
                  ? "bg-white text-black"
                  : "bg-[#111] border border-[#333] text-[#666] hover:text-white hover:border-[#555]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Crop area */}
        <div className="flex items-center justify-center bg-[#050505] p-4 max-h-[50vh] overflow-auto">
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={selectedAspect}
              minWidth={50}
              minHeight={50}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{ maxHeight: "45vh", maxWidth: "100%", objectFit: "contain" }}
              />
            </ReactCrop>
          ) : (
            <div className="flex items-center justify-center py-16">
              <span className="w-7 h-7 border-2 border-[#333] border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#1a1a1a]">
          <button onClick={onCancel} className="px-5 py-2.5 text-sm text-[#555] hover:text-white border border-[#222] hover:border-[#444] rounded-xl transition-all">
            Cancel
          </button>
          <div className="flex gap-3">
            <button onClick={() => onCropComplete(file)} className="px-5 py-2.5 text-sm text-[#888] hover:text-white border border-[#333] rounded-xl transition-all">
              Skip Crop
            </button>
            <button onClick={handleDone} disabled={processing}
              className="bg-white text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
              {processing
                ? <><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />Processing…</>
                : "Apply Crop →"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
