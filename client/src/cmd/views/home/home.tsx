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

export class HomeViewModel {
  #giphyService: GiphyService
  #page: AsyncIterableIterator<TrendingResponseData[]> | undefined
  list: Array<TrendingResponseData>
  loading: boolean

  constructor(
    giphyService: GiphyService
  ) {
    this.#giphyService = giphyService
    this.list = []
    this.loading = false

    makeObservable(this, {
      list: kind.array,
      loading: kind.value,
    })
  }

  async onInit() {
    await new Promise(res => setTimeout(res, 500))
    this.#page = this.#giphyService.trending('gif')
    await this.loadMore()
  }

  async loadMore() {
    if (this.loading || !this.#page) {
      return
    }
    this.loading = true
    this.list.push(...(await this.#page.next()).value)
    this.loading = false
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
          <input type="text" placeholder="Search" />
          <button>🔎</button>
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
        onEnter={() => vm.loadMore()}
        rootMargin={window.screen.height + 'px'}
        />
    </Fragment>)
}
