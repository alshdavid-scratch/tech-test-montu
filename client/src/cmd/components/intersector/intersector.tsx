import { h } from "preact"
import { classNames } from "../../../platform/preact/class-names.ts"
import { useEffect, useRef } from "preact/hooks"

export type IntersectorProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
  onEnter?: () => any | Promise<any>
  onExit?: () => any | Promise<any>
  rootMargin?: string
}

/**
 * @description this component will emit an event when it's revealed.
 * This is used to detect proximity to the bottom of the page, it's 
 * more performant to use than polling onscroll events
 */
export function Intersector({ onEnter, onExit, rootMargin, className, ...props }: IntersectorProps) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        onEnter && onEnter()
      } else {
        onExit && onExit()
      }
    }, {
      rootMargin
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [containerRef, onEnter, onExit, rootMargin])

  return <div {...props} ref={containerRef} className={classNames('component-intersector', className)}/>
}
