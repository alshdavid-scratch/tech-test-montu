import { Fetcher } from "../dom/index.ts";
import { Environment } from "../environment/environment.ts";
import { searchRequestGet, SearchRequest, SearchResponseData } from "../giphy-api/search-get/search-get.ts";
import { trendingRequestGet, TrendingRequest, TrendingResponseData } from "../giphy-api/trending-get/trending-get.ts";

export class GiphyService {
  #fetcher: Fetcher
  #env: Environment

  constructor(
    fetcher: Fetcher,
    env: Environment,
  ) {
    this.#fetcher = fetcher
    this.#env = env
  }

  async *search(query: string, kind: 'gifs' | 'stickers' = 'gifs', options: Omit<SearchRequest, 'api_key'|'q'|'offset'> = {}): AsyncIterableIterator<SearchResponseData[]> {
    let offset = 0

    while (true) {
      const result = await searchRequestGet(this.#fetcher, kind, {
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
      const result = await trendingRequestGet(this.#fetcher, kind, {
        api_key: this.#env.giphyApiKey,
        offset,
        ...options
      })

      offset += result.data.length
      yield result.data
    }
  }
}
