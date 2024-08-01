/**
 * Module to set scroll detection without Locomotive Scroll
 * @example
 * <div data-module-scroll="scroll"></div>
 */

import { module as mmodule } from 'modujs'
import modularScroll from 'modularscroll'

export default class Scroll extends mmodule {
  constructor(m) {
    super(m)
    this.events = {}
  }

  init() {
    // eslint-disable-next-line new-cap
    this.scroll = new modularScroll({
      el: this.el,
      name: 'scroll',
      class: 'is-inview',
    })
    window.scroll = this.scroll
  }

  reInit() {
    this.scroll.init()
  }

  update() {
    this.scroll.update()
  }

  destroy() {
    this.scroll.destroy()
    window.scroll = null
  }
}
