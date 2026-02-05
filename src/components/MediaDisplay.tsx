import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { resolveImagePath } from '../utils/imageResolver';

interface MediaDisplayProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

const isVideo = (src: string) => /\.(mp4|mov)$/i.test(src);
const isPdf = (src: string) => /\.pdf$/i.test(src);

export function MediaDisplay({
  src,
  alt,
  className,
  onClick,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false
}: MediaDisplayProps) {
  if (isPdf(src)) {
    const resolved = resolveImagePath(src);
    return (
      <object
        data={resolved}
        type="application/pdf"
        className={className}
        aria-label={alt}
      >
        <a href={resolved} target="_blank" rel="noreferrer">
          {alt}
        </a>
      </object>
    );
  }

  if (isVideo(src)) {
    return (
      <video
        src={resolveImagePath(src)}
        className={className}
        aria-label={alt}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        onClick={onClick}
      >
        {alt}
      </video>
    );
  }

  return (
    <ImageWithFallback
      src={resolveImagePath(src)}
      alt={alt}
      className={className}
      onClick={onClick}
    />
  );
}
