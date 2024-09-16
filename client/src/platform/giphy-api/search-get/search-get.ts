/**
  https://developers.giphy.com/docs/api/endpoint/#search
  https://api.giphy.com/v1/gifs/search
*/


import { IFetch } from "../../dom/index.ts";

export type SearchRequest = {
  api_key: string
  q: string
  limit?: number
  offset?: number
  Default?: string
  Maximum?: string
  rating?: string
  lang?: string
  random_id?: string
  bundle?: string
};

export type SearchResponseImage = {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size?: string;
  mp4?: string;
  webp_size?: string;
  webp?: string;
  frames?: string;
  hash?: string;
};

export type SearchResponseData = {
  alt_text: string
  analytics: string
  analytics_response_payload: string
  bitly_gif_url: string
  bitly_url: string
  content_url: string
  embed_url: string
  id: string
  images: {
    original: SearchResponseImage;
    downsized: SearchResponseImage;
    downsized_large: SearchResponseImage;
    downsized_medium: SearchResponseImage;
    downsized_small: SearchResponseImage;
    downsized_still: SearchResponseImage;
    fixed_height: SearchResponseImage;
    fixed_height_downsampled: SearchResponseImage;
    fixed_height_small: SearchResponseImage;
    fixed_height_small_still: SearchResponseImage;
    fixed_height_still: SearchResponseImage;
    fixed_width: SearchResponseImage;
    fixed_width_downsampled: SearchResponseImage;
    fixed_width_small: SearchResponseImage;
    fixed_width_small_still: SearchResponseImage;
    fixed_width_still: SearchResponseImage;
    looping: SearchResponseImage;
    original_still: SearchResponseImage;
    original_mp4: SearchResponseImage;
    preview: SearchResponseImage;
    preview_gif: SearchResponseImage;
    preview_webp: SearchResponseImage;
    "480w_still": SearchResponseImage;
  };
  import_datetime: string
  is_sticker: string
  rating: string
  slug: string
  source: string
  source_post_url: string
  source_tld: string
  title: string
  trending_datetime: string
  type: string
  url: string
  user: string
  username: string
}

export type SearchResponse = {
  data: Array<SearchResponseData>
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

export async function searchRequestGet(
  fetcher: IFetch,
  kind: 'gifs' | 'stickers',
  options: SearchRequest
): Promise<SearchResponse> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    query.set(key, value.toString());
  }

  const response = await fetcher.fetch(
    `https://api.giphy.com/v1/${kind}/search?${query.toString()}`
  );

  if (!response.ok) {
    throw new Error("Request failed")
  }
  
  return await response.json()
}
