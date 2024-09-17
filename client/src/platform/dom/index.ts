// Interface segregation for testing
export interface IFetch extends Pick<Window, 'fetch'> {}
export interface ICrypto extends Pick<Window, 'crypto'> {}
export interface ILocalStorage extends Pick<Window, 'localStorage'> {}

export const WindowToken = 'Window'
export const DocumentToken = Symbol('Document')
