/**
 * Slider module with Embla Carousel (watch twig snippet to see what you need)
 * @example
 * <section class="m-slider" data-module-slider data-config="{{ config|json_encode() }}">
 *  <div class="m-slider__viewport" data-slider="viewport">
 *    <div class="m-slider__container"></{{tag}}>
 *  </div>
 *  <div class="m-slider__progress">
 *    <div class="m-slider__bar" data-slider="bar"></div>
 *  </div>
 *  <button data-slider=prevBtn>Prev</button>
 *  <button data-slider=nextBtn>Next</button>
 * </section>
 */
import { module as mmodule } from 'modujs'
import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import ClassNames from 'embla-carousel-class-names'
import { throttle } from '@scripts/utils/tools'

export default class Slider extends mmodule {
  constructor(m) {
    super(m)

    this.events = {
      click: {},
    }

    const [viewport] = this.$('viewport')
    const container = viewport || this.el

    this.options = this.setOptions()

    const plugins = this.setPlugins()

    this.slider = EmblaCarousel(container, this.options, plugins)
    this.slider.on('resize', this.onSliderResize.bind(this))
    this.setControls()
    this.setDots()
    this.setOnScroll()
    this.setOnSelect()
    this.setProgress()
    this.setWatchDrag()
    this.onSliderResize()
  }

  reInit(options = {}) {
    this.slider.reInit(options)
  }

  setOptions() {
    const options = {
      loop: false,
      controls: false,
      dots: false,
      align: 'start',
      autoplay: false,
      direction: 'ltr',
      startIndex: 0,
      skipSnaps: false,
      watchSlides: false,
      watchDrag: false,
      onScroll: null,
      containScroll: 'trimSnaps',
      inViewThreshold: 0.5,
      classes: true,
      breakpoints: {},
    }

    try {
      const user = JSON.parse(this.el.dataset.config)
      this.el.removeAttribute('data-config')
      return Object.assign(options, user)
    } catch (e) {
      return options
    }
  }

  setPlugins() {
    const plugins = []
    if (this.options.autoplay) {
      plugins.push(
        Autoplay({
          delay: Number(this.options.autoplay) * 1000,
          stopOnInteraction: true,
        })
      )
    }

    if (this.options.classes) {
      plugins.push(
        ClassNames({
          selected: '-inView',
          draggabble: '-draggable',
          dragging: '-dragging',
        })
      )
    }

    return plugins
  }

  onSliderResize() {
    const isScrollable = this.slider.internalEngine().scrollSnaps.length > 1
    this.el.classList[isScrollable ? 'remove' : 'add']('-fixed')
    this.slider.reInit({
      active: isScrollable,
      align: isScrollable ? this.options.align : 'center',
      controls: isScrollable ? this.options.controls : false,
      progress: isScrollable ? this.options.progress : false,
    })
  }

  setWatchDrag() {
    if (!this.options.watchDrag) {
      return
    }

    const onDrag = this.onDrag.bind(this)
    this.slider.on('select', onDrag)
  }

  // eslint-disable-next-line class-methods-use-this
  onDrag() {}

  setOnScroll() {
    if (!this.options.onScroll) {
      return
    }
    const onScroll = throttle(this[this.options.onScroll].bind(this), 50)
    this.slider.on('scroll', onScroll).on('select', onScroll)
    onScroll()
  }

  setOnSelect() {
    if (!this.options.onSelect) {
      return
    }
    const onSelect = throttle(this[this.options.onSelect].bind(this), 50)
    this.slider.on('select', onSelect)
    // .on('init', onSelect)
    // .on('reInit', onSelect)
  }

  setControls() {
    if (!this.options.controls) {
      return
    }
    const disablePrevAndNextBtns = this.disablePrevAndNextBtns.bind(this)
    this.slider
      .on('select', disablePrevAndNextBtns)
      .on('init', disablePrevAndNextBtns)

    this.events.click.nextBtn = 'scrollNext'
    this.events.click.prevBtn = 'scrollPrev'

    this.scrollNext = this.slider.scrollNext
    this.scrollPrev = this.slider.scrollPrev
  }

  setDots() {
    if (!this.options.dots) {
      return
    }
    const setSelectedDotBtn = this.setSelectedDotBtn.bind(this)
    this.slider.on('select', setSelectedDotBtn).on('init', setSelectedDotBtn)
    this.events.click.dot = 'selectDotBtn'
    this.generateDotBtns()
  }

  generateDotBtns() {
    const template = document.querySelector('#dotTemplate').innerHTML
    const [dotsContainer] = this.$('dotsContainer')
    const dots = this.slider.scrollSnapList().reduce((acc, progress, index) => {
      const item = template.replace('{index}', `data-index="${index}"`)
      return acc + item
    }, '')
    dotsContainer.innerHTML = dots
  }

  selectDotBtn(event) {
    const index = Number(event.currentTarget.dataset.index)
    this.slider.scrollTo(index)
  }

  setSelectedDotBtn() {
    const previous = this.slider.previousScrollSnap()
    const selected = this.slider.selectedScrollSnap()
    const dots = this.$('dot')
    dots[previous].classList.remove('-active')
    dots[selected].classList.add('-active')
  }

  disablePrevAndNextBtns() {
    const prevBtn = this.$('prevBtn')
    const nextBtn = this.$('nextBtn')

    if (this.slider.canScrollPrev()) {
      prevBtn[0].removeAttribute('disabled')
    } else {
      prevBtn[0].setAttribute('disabled', 'disabled')
    }

    if (this.slider.canScrollNext()) {
      nextBtn[0].removeAttribute('disabled')
    } else {
      nextBtn[0].setAttribute('disabled', 'disabled')
    }
  }

  setProgress() {
    if (!this.options.progress) {
      return
    }
    const [bar] = this.$('bar')
    this.progress = bar
    const applyProgress = this.applyProgress.bind(this)
    const items = this.slider.scrollSnapList()
    this.deltaProgress = 1 / items.length
    this.slider
      .on('init', applyProgress)
      .on('reInit', applyProgress)
      .on('scroll', applyProgress)
  }

  applyProgress() {
    const { deltaProgress } = this
    const progress = Math.max(
      0,
      Math.min(
        1,
        this.slider.scrollProgress() * (1 - deltaProgress) + deltaProgress
      )
    )
    this.progress.style.transform = `translate3d(${progress * 100}%,0px,0px)`
  }

  // eslint-disable-next-line class-methods-use-this
  onScroll() {}

  updateCarouselImage() {
    const selected = this.slider.selectedScrollSnap()
    const images = this.$('image')
    const current = images[selected]

    if (!current) {
      return
    }
    this.call('loadImage', { item: current, config: {} }, 'Website', 'website')
  }
}
