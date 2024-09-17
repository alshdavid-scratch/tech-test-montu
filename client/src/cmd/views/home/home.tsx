import './home.scss'
import { h, Fragment } from "preact";
import { useViewModel } from '../../../platform/rx/preact.ts';
import { GiphyService, IGiphyService } from '../../../platform/giphy/giphy-service.ts';
import { useInject } from '../../contexts/app.tsx';
import { TrendingResponseData } from '../../../platform/giphy-api/trending-get/trending-get.ts';
import { makeObservable, kind } from '../../../platform/rx/index.ts';
import { Video } from '../../components/video/video.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';
import { Intersector } from '../../components/intersector/intersector.tsx';
import { SearchResponseData } from '../../../platform/giphy-api/search-get/search-get.ts';
import { Input } from '../../components/input/input.tsx';
import { Icon } from '../../components/icon/icon.tsx';
import { WindowToken } from '../../../platform/dom/index.ts';

export class HomeViewModel {
  #giphyService: IGiphyService
  #page: AsyncIterableIterator<TrendingResponseData[] | SearchResponseData[]> | undefined
  list: Array<TrendingResponseData | SearchResponseData>
  loading: boolean
  showFavorites: boolean
  searchInput: string
  favorites: Record<string, TrendingResponseData | SearchResponseData>

  constructor(
    giphyService: IGiphyService
  ) {
    this.#giphyService = giphyService
    this.list = []
    this.loading = false
    this.showFavorites = false
    this.searchInput = ''
    this.favorites = {}

    makeObservable(this, {
      list: kind.array,
      loading: kind.value,
      searchInput: kind.value,
      showFavorites: kind.value,
      favorites: kind.value,
    })
  }

  async onInit() {
    this.#page = this.#giphyService.trending()
    this.favorites = await this.#giphyService.getFavorites()
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

  async toggleFavorite(data: TrendingResponseData | SearchResponseData) {
    this.#giphyService.toggleFavorite(data)
    this.favorites = await this.#giphyService.getFavorites()
  }
}

export function HomeView() {
  const windowRef = useInject<Window>(WindowToken)
  const giphyService = useInject(GiphyService)
  const vm = useViewModel(() => new HomeViewModel(giphyService))

  return (
    <Fragment>
      <nav class="navbar">
        <div className="content-max-width">
          <div>
            <div class="logo">STUDIO GIFLY</div>
          </div>
          <div className="quick-menu">
            <Icon 
              kind='heart' 
              variant='solid'
              className={classNames('show-favorites', ['active', vm.showFavorites])} 
              onClick={() => vm.showFavorites = !vm.showFavorites}/>

            <a href="https://github.com/alshdavid-scratch/tech-test-montu">
              <img src="/assets/github.svg" />
            </a>
          </div>
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
          {!vm.showFavorites && Array.from(Array(vm.list.length || 50).keys()).map((_, i) => <div key={i} className="ghost"></div>)}
        </div>

        <div className="images content-max-width">
        {(vm.showFavorites ? Object.values(vm.favorites) : vm.list).map(result => (
          <div key={result.id} className="image-container">
            <button 
              className={classNames('favorite', ['selected', result.id in vm.favorites])} 
              onClick={() => vm.toggleFavorite(result)}>
              <Icon kind='heart' variant="solid" />
            </button>
            <a
              href={result.url!}
              target="_blank"></a>
            <Video 
              src={result.images.fixed_width.mp4!} 
              poster={result.images.fixed_width_still.url} />
          </div>
        ))}
        </div>
      </main>

      {!vm.showFavorites && !vm.loading && <Intersector 
        onEnter={() => vm.nextPage()}
        rootMargin={windowRef.screen.height + 'px'}
        />}
    </Fragment>)
}
