import './video.scss'
import { h } from "preact"
import { classNames } from "../../../platform/preact/class-names.ts"
import { useState } from 'preact/hooks'

export type VideoProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
  poster?: string
  src: string
}

/** 
 * @description This is a hack to enable lazy loading of videos 
 */
export function Video({ className, src, poster, ...props}: VideoProps) {
  const [hasLoaded, setHasLoaded] = useState(false)

  return <div {...props} className={classNames('component-video', ['loaded', hasLoaded], className)}>
    {poster && <img 
      loading="lazy"
      src={poster} 
      alt="" /> }
      
    <iframe
      src='/assets/video.html'
      onLoad={() => setHasLoaded(true)}
      name={JSON.stringify({ src, poster })} 
      loading="lazy" 
      frameborder="0" />
  </div>
}