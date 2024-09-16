import './home.scss'
import { h, Fragment } from "preact";
import { useViewModel } from '../../../platform/rx/preact.ts';

export class HomeViewModel {
  async onInit() {
  }
}

export function HomeView() {
  const _vm = useViewModel(() => new HomeViewModel())

  return (
    <Fragment>
      <nav class="navbar">
        <div className="content-max-width">
          <div>
            <div class="logo">STUDIO GIFLY</div>
          </div>
          <div>
            <a href="https://github.com/alshdavid-scratch/tech-test-montu"><img src="/assets/github.svg" /></a>
          </div>
        </div>
      </nav>

      <nav className="search">
        <div className="content-max-width">
          <input type="text" placeholder="Search" />
          <button>🔎</button>
        </div>
      </nav>

      <main class="view-home content-max-width">
      </main>

      <footer>
        <div className="content-max-width">
          <div className="author">David Alsh</div>
        </div>
      </footer>
    </Fragment>)
}
