import { h } from "preact"
import { classNames } from "../../../platform/preact/class-names.ts"
import { useEffect, useRef, useState } from "preact/hooks"

export type IntersectorProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
  onEnter?: () => any | Promise<any>
  onExit?: () => any | Promise<any>
  rootMargin?: string
  threshold?: number | number []
  root?: Element | Document | null
}
 
/**
 * @description this component will emit an event when it's revealed.
 * This is used to detect proximity to the bottom of the page, it's 
 * more performant to use than polling onscroll events
 */
export function Intersector({ onEnter, onExit, rootMargin, threshold, root, className,  children, ...props }: IntersectorProps) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      setIsVisible(checkVisible(containerRef.current))
    }
  }, [containerRef, onEnter, onExit, children, rootMargin, threshold, root, className])

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        setIsVisible(true)
        onEnter && onEnter()
      } else {
        setIsVisible(false)
        onExit && onExit()
      }
    }, {
      root,
      rootMargin,
      threshold,
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [containerRef, onEnter, onExit, children, rootMargin, threshold, root, className])

  

  return <div 
    {...props} 
    ref={containerRef} 
    className={classNames('component-intersector', className)}>
    {children && isVisible && children}
    </div>
}

function checkVisible(elm: HTMLDivElement) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}