import { getSitePhoto, photoSrcSet } from '@/lib/site-photos'

type SitePhotoProps = {
  src: string
  alt?: string
  sizes: string
  eager?: boolean
  className?: string
}

/** Pre-optimized local sources keep 4K available without sending it to every phone. */
export function SitePhoto({ src, alt, sizes, eager = false, className = '' }: SitePhotoProps) {
  const photo = getSitePhoto(src)
  return <img
    className={`site-photo ${className}`.trim()}
    src={photo ? src.replace('.webp', '-1280.webp') : src}
    srcSet={photo ? photoSrcSet(src) : undefined}
    sizes={photo ? sizes : undefined}
    alt={alt ?? photo?.alt ?? ''}
    width={photo?.width}
    height={photo?.height}
    loading={eager ? 'eager' : 'lazy'}
    fetchPriority={eager ? 'high' : undefined}
    decoding="async"
    style={photo ? { objectPosition: photo.position } : undefined}
  />
}
