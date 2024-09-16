import { Fetcher, Result } from "../dom/index.ts";
import { Environment } from "../environment/environment.ts";
import { searchGifsRequestGet, SearchRequest, SearchResponse } from "../giphy-api/search-get/search-get.ts";
import { trendingGifsRequestGet, TrendingRequest, TrendingResponse, trendingStickersRequestGet } from "../giphy-api/trending-get/trending-get.ts";

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

  async search(query: string, kind: 'gif' | 'sticker', options: Omit<SearchRequest, 'api_key'|'q'> = {}): Promise<Result<SearchResponse, Error>> {
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

    return [undefined, new Error('invalid type selected')]
  }

  async trending(kind: 'gif' | 'sticker', options: Omit<TrendingRequest, 'api_key'> = {}): Promise<Result<TrendingResponse, Error>> {
    const args = {
      api_key: this.#env.giphyApiKey,
      ...options
    }

    if (kind === 'gif') {
      return trendingGifsRequestGet(this.#fetcher, args)
    } else if (kind === 'sticker') {
      return trendingStickersRequestGet(this.#fetcher, args)
    }

    return [undefined, new Error('invalid type selected')]
  }
}
