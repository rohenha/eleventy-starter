import { module } from 'modujs'
import { translate, compose, toCSS } from 'transformation-matrix'

export default class Marquee extends module {
  constructor(m) {
    super(m)

    this.play = this.change.bind(this, true)
    this.stop = this.change.bind(this, false)

    this.options = this.setOptions()

    this.active = this.options.autoplay

    if (this.options.direction) {
      this.options.speed = -this.options.speed
    }

    this.width = 0
    this.position = 0
    this.els = []
    const [viewport] = this.$('viewport')
    this.viewport = viewport

    if (this.options.hover) {
      this.events = {
        mouseenter: 'stop',
        mouseleave: 'play',
      }
    }
  }

  setOptions() {
    const options = {
      pause: false,
      hover: false,
      autoplay: false,
      direction: true, // true == left
      speed: 1,
    }

    try {
      const user = JSON.parse(this.el.dataset.config)
      this.el.removeAttribute('data-config')
      return Object.assign(options, user)
    } catch (e) {
      return options
    }
  }

  setEls() {
    const els = this.$('slide')
    const array = []
    const length = els.length - 1

    for (let index = 0; index <= length; index += 1) {
      const single = els[index];

      single.removeAttribute('style')
      const bounding = single.getBoundingClientRect()
      const elWidth = bounding.width
      array.push({
        el: single,
        width: elWidth,
        left: bounding.left,
        moved: false,
      })

    }

    this.els = array

    // if (length >= 2) {
    //   const lastEl = array[length]
    //   const secondEl = array[1]
    //   const firstEl = array[0]
    //   const space = secondEl.left - (firstEl.left + firstEl.width)
    //   this.width = lastEl.left + lastEl.width - firstEl.left + space
    // } else {
    //   this.width = 0
    // }
  }

  setSizes() {
    this.width = this.viewport.offsetWidth
    this.limit = this.el.offsetWidth
    this.maxRevert = -this.width + this.limit
    this.position = this.options.direction ? 0 : this.maxRevert
    this.setPosition()
    this.setEls()

    this.playable = this.width > this.limit

    if (this.options.autoplay) {
      this.active = this.playable
    }

    const classFunctionName = this.playable ? 'remove' : 'add'
    this.el.classList[classFunctionName]('-disabled')
  }

  resize() {
    if (!this.active) {
      return
    }

    this.setSizes()

  }

  toggle() {
    this.change(!this.active)
  }

  toggleEnter({ enter }) {
    this.change(enter)
  }

  change(state) {
    if (!this.playable) {
      return
    }

    this.active = state
  }

  animate() {
    if (!this.active) {
      return
    }
    const reset = this.updatePosition()

    this.updateEls(reset)
  }

  updatePosition() {
    let reset = false
    let position = this.position + this.options.speed

    if (this.options.direction && Math.abs(position) >= this.width) {
      position = 0
      reset = true
    }

    if (!this.options.direction && position >= this.limit) {
      position = this.maxRevert
      reset = true
    }

    this.position = position
    return reset
  }

  aAnimate() {
    if (!this.active) {
      return
    }

    this.setPosition()
  }

  setPosition() {
    const matrix = compose(translate(this.position, 0))
    this.viewport.style.transform = toCSS(matrix)
  }

  updateEls(reset) {
    const { els } = this
    const length = els.length - 1
    for (let index = length; index >= 0; index -= 1) {
      const single = els[index];
      single.outside = this.isOutsideViewport(single)
      if (reset && single.moved && !single.outside) {
        single.moved = false
        single.el.removeAttribute('style')
      } else {
        this.updateElPosition(single)
      }
    }
  }

  updateElPosition(single) {
    if (single.moved) {
      return
    }

    if (single.outside) {
      single.moved = true
      single.el.style.left = this.options.direction ? `100%` : `-100%`
      // single.el.style.left = this.options.direction ? `${this.width}px` : `-${this.width}px`
    }
  }

  isOutsideViewport(single) {
    const position = single.left + this.position
    return (
      (this.options.direction && position + single.width < 0) ||
      (!this.options.direction && position + this.maxRevert > 0)
    )
  }

  initModule() {
    this.setSizes()
  }
}
