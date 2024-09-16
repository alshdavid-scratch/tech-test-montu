// Interface segregation for testing
export interface IFetch extends Pick<Window, 'fetch'> {}
export interface ILocalStorage extends Pick<Window, 'localStorage'> {}
