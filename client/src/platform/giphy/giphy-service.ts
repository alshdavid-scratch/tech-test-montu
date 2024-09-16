import { IFetch, ILocalStorage } from "../dom/index.ts";
import { Environment } from "../environment/environment.ts";
import { searchRequestGet, SearchRequest, SearchResponseData } from "../giphy-api/search-get/search-get.ts";
import { trendingRequestGet, TrendingRequest, TrendingResponseData } from "../giphy-api/trending-get/trending-get.ts";

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

  toggleFavorite(data: SearchResponseData | TrendingResponseData) {
    const favorites: Record<string, SearchResponseData | TrendingResponseData> = JSON.parse(this.#localStorage.localStorage.getItem('favorites') || '{}')
    if (data.id in favorites) {
      delete favorites[data.id]
    } else {
      favorites[data.id] = data
    }
    this.#favorites = favorites
    this.#localStorage.localStorage.setItem('favorites', JSON.stringify(favorites))
  }

  getFavorites(): Record<string, SearchResponseData | TrendingResponseData> {
    if (!this.#favorites) {
      this.#favorites = JSON.parse(this.#localStorage.localStorage.getItem('favorites') || '{}')
    }
    return this.#favorites!
  }

  async *search(query: string, kind: 'gifs' | 'stickers' = 'gifs', options: Omit<SearchRequest, 'api_key'|'q'|'offset'> = {}): AsyncIterableIterator<SearchResponseData[]> {
    let offset = 0

    while (true) {
      const result = await searchRequestGet(this.#fetch, kind, {
        api_key: this.#env.giphyApiKey,
        q: query,
        offset,
        ...options
      })

      offset += result.data.length
      yield result.data
    }
  }

  async *trending(kind: 'gifs' | 'stickers' = 'gifs', options: Omit<TrendingRequest, 'api_key' | 'offset'> = {}): AsyncIterableIterator<TrendingResponseData[]> {
    let offset = 0

    while (true) {
      const result = await trendingRequestGet(this.#fetch, kind, {
        api_key: this.#env.giphyApiKey,
        offset,
        ...options
      })

      offset += result.data.length
      yield result.data
    }
  }
}
