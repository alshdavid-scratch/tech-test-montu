export type Environment = Readonly<typeof Environment>
export const Environment = Object.freeze({
  // @ts-expect-error
  production: production as boolean,
  // @ts-expect-error
  giphyApiKey: giphyApiKey as string,
})
