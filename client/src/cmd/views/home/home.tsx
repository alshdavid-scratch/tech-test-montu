import './home.scss'
import { h, Fragment } from "preact";
import { useViewModel } from '../../../platform/rx/preact.ts';
import { GiphyService } from '../../../platform/giphy/giphy-service.ts';
import { useInject } from '../../contexts/app.tsx';
import { Environment } from '../../../platform/environment/environment.ts';
import { TrendingResponse } from '../../../platform/giphy-api/trending-get/trending-get.ts';
import { makeObservable, kind } from '../../../platform/rx/index.ts';
import { Video } from '../../components/video/video.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';

export class HomeViewModel {
  #giphyService: GiphyService
  list: Array<TrendingResponse['data'][0]>
  loading: boolean

  constructor(
    giphyService: GiphyService
  ) {
    this.#giphyService = giphyService
    this.list = []
    this.loading = true

    makeObservable(this, {
      list: kind.array,
      loading: kind.value,
    })
  }

  async onInit() {
    await new Promise(res => setTimeout(res, 500))
    const [result, error] = await this.#giphyService.trending('gif')
    if (error) return
    this.list = result.data
    this.loading = false
  }
}

export function HomeView() {
  const env = useInject(Environment)
  const giphyService = useInject(GiphyService)
  const vm = useViewModel(() => new HomeViewModel(giphyService))

  console.log(vm.list)
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
            don't go blank before the real content loads    */}
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
    </Fragment>)
}
