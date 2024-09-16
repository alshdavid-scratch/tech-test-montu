// Interface segregation for testing
export interface Fetcher extends Pick<Window, 'fetch'> {}

// Typed errors
export type Result<T, E> = [T, undefined] | [undefined, E]


