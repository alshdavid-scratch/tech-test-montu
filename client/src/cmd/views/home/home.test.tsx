import { afterEach, beforeEach, describe, test } from 'node:test'
import * as assert from 'node:assert'
import { h, render } from 'preact'
import { HomeViewModel, HomeView } from './home.tsx'
import { MockedInterface, mockInterface } from '../../../../test/dynamic-mock/dynamic-mock.ts'
import { BrowserPage } from '../../../../test/browser/browser.ts'
import { AppContext, ProviderMap } from '../../contexts/app.tsx'
import { GiphyService, IGiphyService } from '../../../platform/giphy/giphy-service.ts'
import { WindowToken } from '../../../platform/dom/index.ts'

describe('HomeView', () => {
  let giphyService: MockedInterface<IGiphyService>
  let windowRef: MockedInterface<Window>

  describe('HomeViewModel', () => {
    beforeEach(() => {
      giphyService = mockInterface()
    })

    describe('constructor', () => {
      test('should not throw', () => {
        assert.doesNotThrow(() => new HomeViewModel(giphyService))
      })
    })
    
    describe('instance', () => {
      let vm: HomeViewModel

      beforeEach(() => {
        vm = new HomeViewModel(giphyService)
      })
    })
  })

  describe('HomeViewComponent', () => {
    let provider: ProviderMap
    let browser: BrowserPage

    beforeEach(async () => {
      provider = new Map()
      browser = new BrowserPage()

      await browser.exec()
      const div = browser.document.createElement('div')
      browser.document.body.appendChild(div)

      // @ts-expect-error
      globalThis.document = browser.document
      // @ts-expect-error
      globalThis.window = browser.window

      provider.set(GiphyService, giphyService)
      provider.set(WindowToken, windowRef)

      render(
        <AppContext.Provider value={provider}>
          <HomeView />
        </AppContext.Provider>, 
        div
      )
    })

    afterEach(async () => {
      await browser.close()
    })

    test('should render', async () => {
      assert.ok(browser.document.body.children.length >= 1)
    })
  })
})
