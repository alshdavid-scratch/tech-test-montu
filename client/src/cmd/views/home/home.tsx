import './home.scss'
import { h, Fragment } from "preact";
import { GiphyService, IGiphyService } from '../../../platform/giphy/giphy-service.ts';
import { useInject } from '../../contexts/app.tsx';
import { TrendingResponseData } from '../../../platform/giphy-api/trending-get/trending-get.ts';
import { Video } from '../../components/video/video.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';
import { Intersector } from '../../components/intersector/intersector.tsx';
import { SearchResponseData } from '../../../platform/giphy-api/search-get/search-get.ts';
import { Input } from '../../components/input/input.tsx';
import { Icon } from '../../components/icon/icon.tsx';
import { WindowToken } from '../../../platform/dom/index.ts';
import { RxEvent, useReactive } from '../../../platform/preact/rx.ts';

export class HomeViewModel extends EventTarget {
  #giphyService: IGiphyService
  #page: AsyncIterableIterator<TrendingResponseData[] | SearchResponseData[]> | undefined
  #searchInput: string
  #loading: boolean
  #showFavorites: boolean
  #favorites: Record<string, TrendingResponseData | SearchResponseData>
  list: Array<TrendingResponseData | SearchResponseData>
  
  get searchInput() {
    return this.#searchInput
  }

  set searchInput(value) {
    this.#searchInput = value
    RxEvent.emit(this, 'searchInput')
  }

  get showFavorites() {
    return this.#showFavorites
  }

  set showFavorites(value) {
    this.#showFavorites = value
    RxEvent.emit(this, 'showFavorites')
  }

  get loading() {
    return this.#loading
  }

  set loading(value) {
    this.#loading = value
    RxEvent.emit(this, 'loading')
  }

  get favorites() {
    return this.#favorites
  }

  set favorites(value) {
    this.#favorites = value
    RxEvent.emit(this, 'favorites')
  }

  constructor(
    giphyService: IGiphyService
  ) {
    super()
    this.#giphyService = giphyService
    this.list = []
    this.#loading = false
    this.#showFavorites = false
    this.#searchInput = ''
    this.#favorites = {}
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
    RxEvent.emit(this, 'list')
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
  const vm = useReactive(
    () => new HomeViewModel(giphyService),
    'list',
    'loading',
    'searchInput',
    'showFavorites',
    'favorites',
  )

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
