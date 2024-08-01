/**
 * Main module to control all app with Barba Js
 * @example
 * <div data-module-scroll="website" data-animate></div>
 */
import { module as mmodule } from 'modujs'
import barba from '@barba/core'
import Stats from 'stats.js'
import LazyLoad from 'vanilla-lazyload'
import { html, body, isDebug } from '@scripts/utils/environment'
import setGridHelper from '@scripts/utils/grid-helper'
import { debounce } from '@scripts/utils/tools'
import * as transitions from '@scripts/transitions'
import * as views from '@scripts/views'
import { modulesConfig } from '@scripts/organisms/_modules-config'

export default class Website extends mmodule {
  constructor(m) {
    super(m)
    this.updateModules = false
    this.toAnimate = this.el.dataset.animate !== undefined
    this.isAnimating = false
    this.interval = null

    this.size = {
      width: 0,
      height: 0,
    }

    this.animate = this.animate.bind(this)
    this.debounceResize = debounce(this.resize.bind(this, false), 600)

    barba.hooks.afterLeave(this.afterLeave.bind(this))
    barba.hooks.afterEnter(this.afterEnter.bind(this))
    barba.hooks.enter(this.enter.bind(this))
    barba.hooks.once(this.once.bind(this))
    barba.hooks.afterOnce(this.afterOnce.bind(this))
    barba.hooks.after(this.after.bind(this))
    barba.hooks.beforeLeave(this.beforeLeave.bind(this))
  }

  init() {
    const config = {
      debug: isDebug,
      transitions: this.initConfigArray(transitions),
      views: this.initConfigArray(views),
    }

    if (isDebug) {
      config.logLevel = 'info'
      config.timeout = 10000
      setGridHelper()
    } else {
      config.timeout = 10000
    }

    barba.init(config)
  }

  setStats() {
    this.stats = new Stats()
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    body.appendChild(this.stats.dom)
  }

  once() {
    this.lazy = new LazyLoad({
      elements_selector: '[data-lazy]',
      class_loaded: '-loaded',
      class_loading: '-loading',
      class_error: '-error',
      class_entered: '-entered',
      class_exited: '-exited',
    })
  }

  // eslint-disable-next-line class-methods-use-this
  clearCache() {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of barba.cache.k) {
      console.log(key)
      barba.cache.k.delete(key)
    }

    console.log(barba.cache)
  }

  afterOnce() {
    window.addEventListener('resize', this.debounceResize)
    if (isDebug) {
      this.setStats()
    }
    if (isDebug || this.toAnimate) {
      this.requestId = window.requestAnimationFrame(this.animate)
    }

    const options = {
      rootMargin: '0px',
      threshold: 0,
    }

    this.observer = new IntersectionObserver(
      this.onDetectModule.bind(this),
      options,
    )
  }

  resize(force = false) {
    if (
      window.innerWidth < 768 &&
      window.innerWidth === this.size.width &&
      force === false
    ) {
      return
    }
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    if (this.updateModules) {
      this.parseModulesFunctions('resize')
    }
  }

  animate() {
    if (isDebug) {
      this.stats.begin()
    }

    // monitored code goes here
    if (this.updateModules && this.isAnimating) {
      this.parseModulesFunctions('animate')
      this.parseModulesFunctions('aAnimate')
    }

    if (isDebug) {
      this.stats.end()
    }
    this.requestId = window.requestAnimationFrame(this.animate)
  }

  after() {
    this.toggleLoad(false)
  }

  beforeLeave() {
    // this.call('close', null, 'Menu', 'menu')
    this.toggleLoad(true)
  }

  afterLeave() {
    this.updateModules = false
  }

  enter() {
    this.updateLazy()
  }

  updateLazy() {
    this.lazy.update()
  }

  // eslint-disable-next-line class-methods-use-this
  loadImage({ item, config = {} }) {
    if (item.dataset.llStatus === 'loaded') {
      return
    }
    LazyLoad.load(item, config)
  }

  afterEnter() {
    // this.setScrollDetection()
    this.updateModules = true
    this.resize(true)
  }

  toggleLoad(state) {
    this.isAnimating = !state
    window.requestAnimationFrame(() => {
      html.classList[state ? 'remove' : 'add']('is-loaded')
      html.classList[state ? 'add' : 'remove']('is-loading')
    })
  }

  parseModulesFunctions(func) {
    const modulesFunct = modulesConfig[func]
    const { length } = modulesFunct

    if (length === 0) {
      return
    }

    for (let i = length - 1; i >= 0; i -= 1) {
      const moduleName = modulesFunct[i]
      this.call(func, null, moduleName)
    }
  }

  initConfigArray(list) {
    const array = []
    const keys = Object.keys(list)
    const { length } = keys
    const call = this.call.bind(this)
    const $ = this.$.bind(this)
    for (let i = length - 1; i >= 0; i -= 1) {
      const single = list[keys[i]]
      single.init(call, $, {})
      array.push(single)
    }
    return array
  }

  setScrollDetection() {
    const modulesFunct = modulesConfig.scroll
    const { currentModules } = this.modules.app.app
    const keys = Object.keys(currentModules)
    const modulesObserve = {}

    keys.forEach((key) => {
      const moduleInstance = currentModules[key]
      if (modulesFunct.includes(moduleInstance.constructor.name)) {
        const id = key.replace(`${moduleInstance.constructor.name}-`, '')
        moduleInstance.el.dataset.moduleId = id
        moduleInstance.id = id
        modulesObserve[id] = moduleInstance
        this.observer.observe(moduleInstance.el)
      }
    })
    this.modulesObserve = modulesObserve
  }

  unsetScrollDetection() {
    const keys = Object.keys(this.modulesObserve)
    keys.forEach((key) => {
      this.observer.unobserve(this.modulesObserve[key].el)
    })
  }

  onDetectModule(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const moduleInstance =
          this.modulesObserve[entry.target.dataset.moduleId]
        if (moduleInstance) {
          this.call(
            'enter',
            null,
            moduleInstance.constructor.name,
            moduleInstance.id,
          )
          this.call('update', null, 'Scroll', 'scroll')
        }
        if (entry.target.dataset.repeat === undefined) {
          this.observer.unobserve(entry.target)
        }
      } else {
        const moduleInstance =
          this.modulesObserve[entry.target.dataset.moduleId]
        if (moduleInstance) {
          this.call(
            'leave',
            null,
            moduleInstance.constructor.name,
            moduleInstance.id,
          )
        }
      }
    })
  }
}
