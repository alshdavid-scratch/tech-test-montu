import { Fetcher } from "../dom/index.ts";
import { Environment } from "../environment/environment.ts";
import { searchGifsRequestGet, SearchRequest, SearchResponse } from "../giphy-api/search-get/search-get.ts";
import { trendingGifsRequestGet, TrendingRequest, TrendingResponseData, trendingStickersRequestGet } from "../giphy-api/trending-get/trending-get.ts";

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

  async search(query: string, kind: 'gif' | 'sticker', options: Omit<SearchRequest, 'api_key'|'q'> = {}): Promise<SearchResponse> {
    const args = {
      api_key: this.#env.giphyApiKey,
      q: query,
      ...options
    }

    if (kind === 'gif') {
      return searchGifsRequestGet(this.#fetcher, args)
    } else if (kind === 'sticker') {
      return searchGifsRequestGet(this.#fetcher, args)
    }

    throw new Error('invalid type selected')
  }

  async *trending(kind: 'gif' | 'sticker', options: Omit<TrendingRequest, 'api_key' | 'offset'> = {}): AsyncIterableIterator<TrendingResponseData[]> {
    
    const fn = kind === 'gif' ? trendingGifsRequestGet : trendingStickersRequestGet
    let offset = 0

    while (true) {
      const result = await fn(this.#fetcher, {
        api_key: this.#env.giphyApiKey,
        offset,
        ...options
      })

      offset += result.data.length
      yield result.data
    }
  }
}
