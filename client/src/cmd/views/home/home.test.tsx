import { afterEach, beforeEach, describe, test } from 'node:test'
import * as assert from 'node:assert'
import { h, render } from 'preact'
import { HomeViewModel, HomeView } from './home.tsx'
import { MockedInterface, mockInterface } from '../../../../test/dynamic-mock/dynamic-mock.ts'
import { BrowserPage } from '../../../../test/browser/browser.ts'
import { AppContext, ProviderMap } from '../../contexts/app.tsx'
import { GiphyService, IGiphyService } from '../../../platform/giphy/giphy-service.ts'
import { WindowToken } from '../../../platform/dom/index.ts'
import { HTMLDivElement } from 'happy-dom'

describe('HomeView', () => {
  let giphyService: MockedInterface<IGiphyService>

  beforeEach(() => {
    giphyService = mockInterface()
  })

  describe('HomeViewModel', () => {
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
    let outlet: HTMLDivElement

    beforeEach(async () => {
      provider = new Map()
      browser = new BrowserPage()

      await browser.exec()
      outlet = browser.document.createElement('div')
      browser.document.body.appendChild(outlet)

      // @ts-expect-error
      globalThis.document = browser.document

      provider.set(GiphyService, giphyService)
      provider.set(WindowToken, browser.window)

      render(
        <AppContext.Provider value={provider}>
          <HomeView />
        </AppContext.Provider>, 
        outlet
      )
    })

    afterEach(async () => {
      await browser.close()
    })

    test('should render', async () => {
      assert.ok(outlet.children.length >= 1)
    })
  })
})
