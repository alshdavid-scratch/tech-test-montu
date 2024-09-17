import './video.scss'
import { h } from "preact"
import { classNames } from "../../../platform/preact/class-names.ts"
import { Intersector } from '../intersector/intersector.tsx'

export type VideoProps = h.JSX.HTMLAttributes<HTMLVideoElement> & {
  poster?: string
  src: string
}

export function Video({ className, src, poster, ...props}: VideoProps) {
  return (
    <Intersector 
      className={classNames('component-video', className)}
      rootMargin='100% 0px'>
        {/* <img src={poster} alt="" /> */}
      <video 
        {...props}
        src={src} 
        poster={poster}
        autoPlay={true} 
        muted={true} 
        loop={true} 
        disablePictureInPicture={true}
        playsInline={true} />
    </Intersector>
  )
}