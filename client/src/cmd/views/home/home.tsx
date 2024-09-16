import './home.scss'
import { h, Fragment } from "preact";
import { useViewModel } from '../../../platform/rx/preact.ts';
import { GiphyService } from '../../../platform/giphy/giphy-service.ts';
import { useInject } from '../../contexts/app.tsx';
import { TrendingResponseData } from '../../../platform/giphy-api/trending-get/trending-get.ts';
import { makeObservable, kind } from '../../../platform/rx/index.ts';
import { Video } from '../../components/video/video.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';
import { Intersector } from '../../components/intersector/intersector.tsx';
import { SearchResponseData } from '../../../platform/giphy-api/search-get/search-get.ts';
import { Input } from '../../components/input/input.tsx';

export class HomeViewModel {
  #giphyService: GiphyService
  #page: AsyncIterableIterator<TrendingResponseData[] | SearchResponseData[]> | undefined
  list: Array<TrendingResponseData | SearchResponseData>
  loading: boolean
  searchInput: string

  constructor(
    giphyService: GiphyService
  ) {
    this.#giphyService = giphyService
    this.list = []
    this.loading = false
    this.searchInput = ''

    makeObservable(this, {
      list: kind.array,
      loading: kind.value,
      searchInput: kind.value,
    })
  }

  async onInit() {
    this.#page = this.#giphyService.trending()
    await this.nextPage()
  }

  async nextPage() {
    if (this.loading || !this.#page) {
      return
    }
    this.loading = true
    await new Promise(res => setTimeout(res, 500)) // Added lag for dramatic effect
    this.list.push(...(await this.#page.next()).value)
    this.loading = false
  }

  async search() {
    this.list = []
    if (this.searchInput !== '') {
      this.#page = this.#giphyService.search(this.searchInput)
    }
    await this.nextPage()
  }
}

export function HomeView() {
  const giphyService = useInject(GiphyService)
  const vm = useViewModel(() => new HomeViewModel(giphyService))

  return (
    <Fragment>
      <nav class="navbar">
        <div className="content-max-width">
          <div>
            <div class="logo">STUDIO GIFLY</div>
          </div>
          <a href="https://github.com/alshdavid-scratch/tech-test-montu">
            <img src="/assets/github.svg" />
          </a>
        </div>
      </nav>

      <nav className="search">
        <div className="content-max-width">
          <Input 
            type="text" 
            placeholder="Search" 
            value={vm.searchInput} 
            onInput={e => vm.searchInput = (e.target as HTMLInputElement).value} 
            onEnter={_ => vm.search()}/>

          <button 
            disabled={vm.loading}
            onClick={() => vm.search()}>🔎</button>
        </div>
      </nav>

      <main className={classNames("view-home", ['loaded', !vm.loading])}>
        {/* Ghost elements, leaving them on the DOM so they
            don't go blank before the real content loads.   */}
        <div className="ghosts content-max-width">
          {Array.from(Array(vm.list.length || 50).keys()).map((_, i) => <div key={i} className="ghost"></div>)}
        </div>

        <div className="images content-max-width">
        {vm.list.map(result => (
          <div key={result.id} className="image-container">
            <Video 
              src={result.images.fixed_width.mp4!} 
              poster={result.images.fixed_width_still.url} />
          </div>
        ))}
        </div>
      </main>

      <Intersector 
        onEnter={() => vm.nextPage()}
        rootMargin={window.screen.height + 'px'}
        />
    </Fragment>)
}
