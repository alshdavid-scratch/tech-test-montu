/**
  https://developers.giphy.com/docs/api/endpoint/#search
  https://api.giphy.com/v1/gifs/search
*/


import { Fetcher, Result } from "../../dom/index.ts";

export type SearchRequest = {
  api_key: string
  q: string
  limit?: number
  Default?: string
  Maximum?: string
  rating?: string
  lang?: string
  random_id?: string
  bundle?: string
};


export type SearchResponse = {
  data: Array<{
    id: string
    slug: string
    url: string
    bitly_url: string
    embed_url: string
    username: string
    source: string
    rating: string
    content_url: string
    user?: {
      avatar_url: string
      banner_url: string
      profile_url: string
      username: string
      display_name: string
    }
    source_tld: string
    source_post_url: string
    update_datetime: string
    create_datetime: string
    import_datetime: string
    trending_datetime: string
    images: string
    title: string
    alt_text: string
  }>
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
};

export async function searchGifsRequestGet(
  fetcher: Fetcher,
  options: SearchRequest
): Promise<Result<SearchResponse, Error>> {
  try {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
      query.set(key, value.toString());
    }

    const response = await fetcher.fetch(
      `https://api.giphy.com/v1/gifs/trending?${query.toString()}`
    );

    if (!response.ok) {
      return [undefined, new Error("Request failed")];
    }
    
    return [await response.json(), undefined];
  } catch (error: any) {
    return [undefined, error];
  }
}

export async function searchStickersRequestGet(
  fetcher: Fetcher,
  options: SearchRequest
): Promise<Result<SearchResponse, Error>> {
  try {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
      query.set(key, value.toString());
    }

    const response = await fetcher.fetch(
      `https://api.giphy.com/v1/stickers/trending?${query.toString()}`
    );

    if (!response.ok) {
      return [undefined, new Error("Request failed")];
    }
    
    return [await response.json(), undefined];
  } catch (error: any) {
    return [undefined, error];
  }
}
