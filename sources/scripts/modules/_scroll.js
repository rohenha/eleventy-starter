/**
 * Locomotive Module for smooth Scroll
 * @example
 * <div data-module-scroll="scroll"></div>
 */

import { module as mmodule } from 'modujs'
import LocomotiveScroll from 'locomotive-scroll'

export default class Scroll extends mmodule {
  constructor(m) {
    super(m)
    this.state = true
    this.rafRender = null
  }

  init() {
    if (this.el.dataset.preventReset === undefined) {
      // eslint-disable-next-line no-restricted-globals
      history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }
    const orientation =
      this.el.dataset.horizontal !== undefined ? 'horizontal' : 'vertical'

    this.scroll = new LocomotiveScroll({
      lenisOptions: {
        orientation,
      },
      modularInstance: this,
      autoResize: false,
      initCustomTicker: (render) => {
        this.rafRender = render
      },
      destroyCustomTicker: () => {
        this.rafRender = null
      },
      autoStart: true,
      scrollCallback: this.onScroll.bind(this),
    })

    this.scrollOrientation = 1
    this.lastProgress = 0

    this.resize = this.scroll.resize.bind(this.scroll)
  }

  aAnimate() {
    if (this.rafRender) {
      this.rafRender()
    }
  }

  onScroll({ progress }) {}

  leavePage(container) {
    this.scroll.removeScrollElements(container)
  }

  enterPage(container) {
    this.scroll.addScrollElements(container)
  }

  toggle(state) {
    if (state === this.state) {
      return
    }

    this.state = state
    const functionName = state ? 'start' : 'stop'
    this.scroll[functionName]()
  }

  update() {
    this.scroll.resize()
  }

  destroy() {
    this.scroll.destroy()
  }

  scrollTo({ target = 0, options = {} }) {
    this.scroll.scrollTo(target, options)
  }
}
