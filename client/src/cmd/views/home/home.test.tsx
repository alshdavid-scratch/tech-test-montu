import { afterEach, beforeEach, describe, test } from 'node:test'
import * as assert from 'node:assert'
import { h, render } from 'preact'
import { HomeViewModel, HomeView } from './home.tsx'
import { MockedInterface, mockInterface } from '../../../../test/dynamic-mock/dynamic-mock.ts'
import { BrowserPage } from '../../../../test/browser/browser.ts'
import { AppContext, ProviderMap } from '../../contexts/app.tsx'

describe('HomeView', () => {
  describe('HomeViewModel', () => {
    describe('constructor', () => {
      test('should not throw', () => {
        assert.doesNotThrow(() => new HomeViewModel())
      })
    })
    
    describe('instance', () => {
      let vm: HomeViewModel

      beforeEach(() => {
        vm = new HomeViewModel()
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
