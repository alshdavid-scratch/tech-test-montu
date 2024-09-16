// Interface segregation for testing
export interface Fetcher extends Pick<Window, 'fetch'> {}
