import { IFetch, ILocalStorage } from "../dom/index.ts";
import { Environment } from "../environment/environment.ts";
import { searchRequestGet, SearchRequest, SearchResponseData } from "../giphy-api/search-get/search-get.ts";
import { trendingRequestGet, TrendingRequest, TrendingResponseData } from "../giphy-api/trending-get/trending-get.ts";

export type IGiphyService = Omit<GiphyService, `#${string}`>

export class GiphyService {
  #fetch: IFetch
  #env: Environment
  #localStorage: ILocalStorage
  #favorites: Record<string, SearchResponseData | TrendingResponseData> | undefined

  constructor(
    fetcher: IFetch,
    env: Environment,
    localStorage: ILocalStorage
  ) {
    this.#fetch = fetcher
    this.#localStorage = localStorage
    this.#env = env
  }

  async toggleFavorite(data: SearchResponseData | TrendingResponseData): Promise<void> {
    return new Promise(res => setTimeout(() => {
      const favorites: Record<string, SearchResponseData | TrendingResponseData> = JSON.parse(this.#localStorage.localStorage.getItem('favorites') || '{}')
      if (data.id in favorites) {
        delete favorites[data.id]
      } else {
        favorites[data.id] = data
      }
      this.#favorites = favorites
      this.#localStorage.localStorage.setItem('favorites', JSON.stringify(favorites))
      res()
    }))
  }

  getFavorites(): Promise<Record<string, SearchResponseData | TrendingResponseData>> {
    return new Promise(res => setTimeout(() => {
      if (!this.#favorites) {
        this.#favorites = JSON.parse(this.#localStorage.localStorage.getItem('favorites') || '{}')
      }
      res(this.#favorites!)
    }, 0))
  }

  async *search(query: string, kind: 'gifs' | 'stickers' = 'gifs', options: Omit<SearchRequest, 'api_key'|'q'|'offset' | 'limit'> = {}): AsyncIterableIterator<SearchResponseData[]> {
    let offset = 0

    while (true) {
      const result = await searchRequestGet(this.#fetch, kind, {
        api_key: this.#env.giphyApiKey,
        q: query,
        offset,
        limit: '20',
        ...options
      })

      offset += result.data.length
      yield result.data
    }
  }

  async *trending(kind: 'gifs' | 'stickers' = 'gifs', options: Omit<TrendingRequest, 'api_key' | 'offset' | 'limit'> = {}): AsyncIterableIterator<TrendingResponseData[]> {
    let offset = 0

    while (true) {
      const result = await trendingRequestGet(this.#fetch, kind, {
        api_key: this.#env.giphyApiKey,
        offset,
        limit: '20',
        ...options
      })

      offset += result.data.length
      yield result.data
    }
  }
}
