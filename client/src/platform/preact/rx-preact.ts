import { useEffect, useMemo, useReducer } from "preact/hooks";
import { subscribe } from "./rx.ts";

export function useObservable<T, A extends Array<any>>(ctor: new (...args: A) => T, args: A): T
export function useObservable<T>(ctor: new () => T): T
export function useObservable<T, A extends Array<any>>(ctor: new (...args: A) => T, args?: A): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  const o = useMemo(() => new ctor(...(args || []) as any), [])

  useEffect(() => {
    const dispose = subscribe(o, () => {
      forceUpdate()
    })
    return () => dispose()
  }, [])

  return o
}

export interface ViewModelLifecycle {
  onInit?(): any | Promise<any>
}

export function useViewModel<T>(ctor: () => T): T
export function useViewModel<T extends ViewModelLifecycle>(ctor: () => T): T
export function useViewModel<T extends ViewModelLifecycle>(ctor: () => T): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  const o = useMemo(ctor, [])

  useEffect(() => {
    const dispose = subscribe(o, () => {
      forceUpdate()
    })
    o.onInit && o.onInit()
    return () => dispose()
  }, [])

  return o
}
