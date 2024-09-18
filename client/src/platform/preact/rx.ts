import { useEffect, useMemo, useReducer } from "preact/hooks"

export interface RxOnInit {
  onInit?(): any | Promise<any>
}

const eventName = 'rx:change'

export class RxEvent extends CustomEvent<Set<string>> {
  constructor(keys: Set<string>) {
    super(eventName, { detail: keys })
  }

  static emit(target: EventTarget, ...keys: Array<string>) {
    target.dispatchEvent(new RxEvent(new Set(keys)))
  }
}

export const useReactive = <T extends EventTarget, K extends keyof T>(ctor: () => T, ...properties: Array<K>): T => {
  const o = useMemo(ctor, [])
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void
  
  useEffect(() => {
    const watching: Partial<Record<K, boolean>> = {}

    console.log(watching)
    for (const key of properties) {
      watching[key] = true
    }

    const fn = ({ detail }: RxEvent) => {
      for (const key of detail.values()) {
        if (!(key in watching)) continue
        forceUpdate()
        break
      }
    }

    //@ts-expect-error
    o.onInit && o.onInit()

    o.addEventListener(eventName, fn as any)
    return () => o.removeEventListener(eventName, fn as any)
  }, [...properties])

  return o
}