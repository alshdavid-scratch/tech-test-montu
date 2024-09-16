import { IFetch } from "./index.ts"

type CacheEntry = [number, any]

// Using a Cached fetch request because GIPHY has a rate limit
// Using during testing/development
export class CachedFetcher implements IFetch {
  #windowRef: Window
  #ttl: number

  constructor(
    windowRef: Window,
    ttl: number,
  ) {
    this.#windowRef = windowRef
    this.#ttl = ttl
  }

  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const key = await getSHA256Hash(`${input.toString()}/${JSON.stringify(init)}`, 20)
    const result = this.#windowRef.localStorage.getItem(key)
    
    if (result) {
      const [timestamp, data]: CacheEntry = JSON.parse(result)
      
      if (timestamp <= Date.now() + this.#ttl) {
        return new Promise<any>(res => {
          setTimeout(() => {
            res({
              ok: true,
              json() {
                return Promise.resolve(data)
              }
            })
          }, 100) // Mock latency
        })
      }
    }

    const response = await this.#windowRef.fetch(input, init)
    const data = await response.json()
    this.#windowRef.localStorage.setItem(key, JSON.stringify([Date.now(), data]))

    return {
      ok: true,
      json() {
        return Promise.resolve(data)
      }
    } as any    
  }
}

const getSHA256Hash = async (input: string, limit? : number) => {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  if (limit) {
    return hash.substring(0, limit)
  }
  return hash;
};