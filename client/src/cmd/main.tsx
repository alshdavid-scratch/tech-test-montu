import './index.scss'
import { h, render } from 'preact'
import { AppContext } from './contexts/app.tsx'
import { HomeView } from './views/home/home.tsx'
import { GiphyService } from '../platform/giphy/giphy-service.ts'
import { Environment } from '../platform/environment/environment.ts'
import { CachedFetcher } from '../platform/dom/cahced-fetch.ts'


// DI system using React context
const provider = new Map()

const cachedFetcher = new CachedFetcher(window, 86_400_000) // cache requests for 24 hours

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

console.log()