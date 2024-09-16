/**
  https://developers.giphy.com/docs/api/endpoint/#trending
  https://api.giphy.com/v1/gifs/trending
*/

import { Fetcher } from "../../dom/index.ts";

export type TrendingRequest = {
  api_key: string;
  limit?: string;
  offset?: number;
  Default?: number;
  Maximum?: number;
  rating?: string;
  random_id?: string;
  bundle?: string;
};

export type TrendingResponseImage = {
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

export type TrendingResponseData = {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: number;
  source_post_url: string;
  is_sticker: string;
  import_datetime: string;
  trending_datetime: string;
  images: {
    original: TrendingResponseImage;
    downsized: TrendingResponseImage;
    downsized_large: TrendingResponseImage;
    downsized_medium: TrendingResponseImage;
    downsized_small: TrendingResponseImage;
    downsized_still: TrendingResponseImage;
    fixed_height: TrendingResponseImage;
    fixed_height_downsampled: TrendingResponseImage;
    fixed_height_small: TrendingResponseImage;
    fixed_height_small_still: TrendingResponseImage;
    fixed_height_still: TrendingResponseImage;
    fixed_width: TrendingResponseImage;
    fixed_width_downsampled: TrendingResponseImage;
    fixed_width_small: TrendingResponseImage;
    fixed_width_small_still: TrendingResponseImage;
    fixed_width_still: TrendingResponseImage;
    looping: TrendingResponseImage;
    original_still: TrendingResponseImage;
    original_mp4: TrendingResponseImage;
    preview: TrendingResponseImage;
    preview_gif: TrendingResponseImage;
    preview_webp: TrendingResponseImage;
    "480w_still": TrendingResponseImage;
  };
  user: {
    avatar_url: string;
    banner_image: string;
    banner_url: string;
    profile_url: string;
    username: string;
    display_name: string;
    description: string;
    instagram_url: string;
    website_url: string;
    is_verified: boolean;
  };
  analytics_response_payload: string;
  analytics: {
    onload: {
      url: string;
    };
    onclick: {
      url: string;
    };
    onsent: {
      url: string;
    };
  };
  alt_text: string;
}

export type TrendingResponse = {
  data: Array<TrendingResponseData>;
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
};

export async function trendingGifsRequestGet(
  fetcher: Fetcher,
  options: TrendingRequest
): Promise<TrendingResponse> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    query.set(key, value.toString());
  }

  const response = await fetcher.fetch(
    `https://api.giphy.com/v1/gifs/trending?${query.toString()}`
  );

  if (!response.ok) {
    throw new Error("Request failed")
  }
  
  return await response.json()
}

export async function trendingStickersRequestGet(
  fetcher: Fetcher,
  options: TrendingRequest
): Promise<TrendingResponse> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    query.set(key, value.toString());
  }

  const response = await fetcher.fetch(
    `https://api.giphy.com/v1/stickers/trending?${query.toString()}`
  );

  if (!response.ok) {
    throw new Error("Request failed")
  }
  
  return await response.json()
}
