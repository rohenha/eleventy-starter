/**
 * Accordeon Module
 * @example
 * <article class="m-accordeon{{ class }}" data-module-{{ moduleName }}="{{ id }}"{{ attributes }}>
 *    <div class="m-accordeon__entete">
 *      <button class="m-accordeon__button" data-{{ moduleName }}="button" aria-expanded="false" aria-controls="accordeon-{{ id }}" data-open="Ouvrir" data-close="Fermer">Ouvrir</button>
 *      <h3 class="m-accordeon__title a-h6 -txtupper">{{ title }}</h3>
 *      <div class="m-accordeon__icon"></div>
 *    </div>
 *    <div id="accordeon-{{ id }}" class="m-accordeon__scroll" data-{{ moduleName }}="scroll">
 *      <div class="m-accordeon__content{{ contentClass }}" data-{{ moduleName }}="content">
 *        {% block content endblock %}
 *      </div>
 *    </div>
 * </article>
 */

import { module as mmodule } from 'modujs'

export default class Accordeon extends mmodule {
  constructor(m) {
    super(m)
    this.open = this.change.bind(this, true)
    this.close = this.change.bind(this, false)
    this.config = {
      duration: 1,
      height: 0,
    }
    this.events = {
      click: {
        button: 'toggle',
      },
    }
  }

  resize() {
    const [content] = this.$('content')
    const [scroll] = this.$('scroll')

    this.config.height = content.offsetHeight
    let duration = (this.config.height * 1) / 600
    duration = Math.min(Math.max(duration, 0.7), 3)
    this.config.duration = duration

    window.requestAnimationFrame(() => {
      scroll.style.setProperty('--atransition', `${this.config.duration}s`)
    })
  }

  toggle() {
    this.change(!this.state)
  }

  change(state) {
    if (this.state === state) {
      return
    }

    this.state = state

    const [scroll] = this.$('scroll')
    const [button] = this.$('button')

    let height = 0
    let text = ''

    if (this.state) {
      height = scroll.scrollHeight
      text = button.dataset.close
    } else {
      text = button.dataset.open
    }

    window.requestAnimationFrame(() => {
      button.setAttribute('aria-expanded', this.state)
      button.innerText = text

      scroll.style.setProperty('--heightscroll', `${height}px`)
    })
  }
}
