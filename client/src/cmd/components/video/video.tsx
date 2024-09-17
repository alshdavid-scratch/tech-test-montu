import './video.scss'
import { h } from "preact"
import { classNames } from "../../../platform/preact/class-names.ts"

export type VideoProps = h.JSX.HTMLAttributes<HTMLVideoElement> & {
  poster?: string
  src: string
}

export function Video({ className, src, poster, ...props}: VideoProps) {
  return (
    <video 
      {...props}
      className={classNames('component-video', className)}
      src={src} 
      poster={poster}
      autoPlay={true} 
      muted={true} 
      loop={true} 
      disablePictureInPicture={true}
      playsInline={true} />
  )
}