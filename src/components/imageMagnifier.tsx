import React, { useEffect, useRef, useState } from "react"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { BsZoomIn } from "react-icons/bs"

// Technique adapted from https://stackoverflow.com/a/76800039
// (Roko C. Buljan, CC BY-SA 4.0): a `position: fixed` lens moved with the
// `translate` CSS property, with `background-position` sampling the
// full-resolution image at 1:1 (no explicit background-size / zoom factor).
const RADIUS = 130

type ImageMagnifierProps = {
  image: IGatsbyImageData
  zoomSrc?: string
  alt: string
  imgStyle?: React.CSSProperties
}

export default function ImageMagnifier({ image, zoomSrc, alt, imgStyle }: ImageMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomSizeRef = useRef<{ width: number; height: number } | null>(null)
  const [magnifierStyle, setMagnifierStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    zoomSizeRef.current = null
    if (!zoomSrc) return
    const preload = new Image()
    preload.src = zoomSrc
    preload.onload = () => {
      zoomSizeRef.current = { width: preload.naturalWidth, height: preload.naturalHeight }
    }
  }, [zoomSrc])

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const container = containerRef.current
    const zoomSize = zoomSizeRef.current
    if (!container || !zoomSize || !zoomSrc) return

    const img = container.querySelector("img[data-main-image]") as HTMLImageElement | null
    if (!img) return

    const imageRect = img.getBoundingClientRect()
    const pointerX = e.clientX - imageRect.left
    const pointerY = e.clientY - imageRect.top
    const deltaX = pointerX / imageRect.width
    const deltaY = pointerY / imageRect.height
    const x = deltaX * zoomSize.width - RADIUS
    const y = deltaY * zoomSize.height - RADIUS

    setMagnifierStyle({
      backgroundImage: `url(${zoomSrc})`,
      backgroundPosition: `${-x}px ${-y}px`,
      // The lens is `position: fixed`, so it's positioned relative to the
      // viewport regardless of where this component sits in the page —
      // it needs the raw pointer coordinates here, not the image-relative
      // offset used for the background-position math above.
      translate: `${e.clientX}px ${e.clientY}px`,
    })
  }

  return (
    <div
      className="image-magnifier"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
    >
      <GatsbyImage image={image} alt={alt} imgStyle={imgStyle} />
      {zoomSrc && <BsZoomIn className="magnifier-zoom-icon" aria-hidden="true" />}
      {zoomSrc && <div className="magnifier-v2-lens" style={magnifierStyle} />}
    </div>
  )
}
