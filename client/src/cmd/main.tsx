import './index.scss'
import { h, render } from 'preact'
import { AppContext } from './contexts/app.tsx'
import { HomeView } from './views/home/home.tsx'
import { GiphyService } from '../platform/giphy/giphy-service.ts'
import { Environment } from '../platform/environment/environment.ts'
import { CachedFetcher } from '../platform/dom/cahced-fetch.ts'


// DI system using React context
const provider = new Map()

// Cache requests for 24 hours
// I need this because the GIPHY has a
// rate limit of 100 requests per month lol
const cachedFetcher = new CachedFetcher(window, 86_400_000)

provider.set(Environment, Environment)
provider.set(GiphyService, new GiphyService(cachedFetcher, Environment))

function App() {
  return (
    <AppContext.Provider value={provider}>
      <HomeView />
    </AppContext.Provider>
  )
}

render(<App />, document.querySelector('#root')!)

if (!Environment.production) {
  // @ts-expect-error
  window.debug = provider
}