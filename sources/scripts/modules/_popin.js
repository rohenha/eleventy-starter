/**
 * Popin Module
 * @example
 * <div class="m-popin{{ class }}" data-module-{{ moduleName }}="{{ id }}" aria-hidden="true"{{ attributes }}>
 *    <div class="m-popin__overlay" tabindex="-1" data-action="close">
 *    <div class="m-popin__container{{ contentClass }}" role="dialog" aria-modal="true" {% if title|length %} aria-label="{{ title }}" {% else %} aria-labelledby="{{ id }}-title" {% endif %}>
 *      {% block content endblock %}
 *    </div>
 *   </div>
 * </div>
 */
import { module as mmodule } from 'modujs'
import { body } from '@scripts/utils/environment'

export default class Popin extends mmodule {
  constructor(m) {
    super(m)
    this.visible = false
    this.config = {
      disableScroll: true,
    }
    this.activeElement = null
    this.open = this.change.bind(this, true)
    this.close = this.change.bind(this, false)
    this.onClick = this.onClick.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  scrollBehaviour(state) {
    if (!this.config.disableScroll) return
    Object.assign(body.style, { overflow: state ? 'hidden' : '' })
  }

  toggleEvents(state) {
    const functionName = state ? 'add' : 'remove'
    this.el[`${functionName}EventListener`]('touchstart', this.onClick)
    this.el[`${functionName}EventListener`]('click', this.onClick)
    document[`${functionName}EventListener`]('keydown', this.onKeyDown)
  }

  onClick(e) {
    const { target } = e
    const { action } = target.dataset
    if (this[action]) {
      this[action]()
      target.blur()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  onKeyDown(event) {
    if (event.keyCode === 27) {
      this.close() // esc
      return
    }
    if (event.keyCode === 9) {
      this.retainFocus(event) // tab
    }
  }

  getFocusableNodes() {
    const FOCUSABLE_ELEMENTS = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden]):not([aria-disabled="true"])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ]
    const nodes = this.el.querySelectorAll(FOCUSABLE_ELEMENTS)
    return Array(...nodes)
  }

  // eslint-disable-next-line complexity
  retainFocus(event) {
    let focusableNodes = this.getFocusableNodes()
    // no focusable nodes
    if (focusableNodes.length === 0) return

    /**
     * Filters nodes which are hidden to prevent
     * focus leak outside modal
     */
    focusableNodes = focusableNodes.filter((node) => node.offsetParent !== null)
    // if disableFocus is true
    if (!this.el.contains(document.activeElement)) {
      focusableNodes[0].focus()
    } else {
      const focusedItemIndex = focusableNodes.indexOf(document.activeElement)

      if (event.shiftKey && focusedItemIndex === 0) {
        focusableNodes[focusableNodes.length - 1].focus()
        event.preventDefault()
      }

      if (
        !event.shiftKey &&
        focusableNodes.length > 0 &&
        focusedItemIndex === focusableNodes.length - 1
      ) {
        focusableNodes[0].focus()
        event.preventDefault()
      }
    }
  }

  setFocusToFirstNode() {
    const focusableNodes = this.getFocusableNodes()
    if (focusableNodes.length === 0) {
      return
    }
    // remove nodes on whose click, the modal closes
    // could not think of a better name :(
    const nodesWhichAreNotCloseTargets = focusableNodes.filter(
      (node) => node.dataset.action !== 'close'
    )
    if (nodesWhichAreNotCloseTargets.length > 0) {
      nodesWhichAreNotCloseTargets[0].focus()
      return
    }

    focusableNodes[0].focus()
  }

  destroy() {
    this.el.remove()
  }

  toggle() {
    this.change(!this.state)
  }

  change(state) {
    if (this.visible === state) {
      return
    }
    this.visible = state
    this.scrollBehaviour(state)
    this.toggleEvents(state)
    this.el.setAttribute('aria-hidden', !state)
    let handler = () => {}

    if (state) {
      this.el.classList.add('-isOpen')
      this.activeElement = document.activeElement

      handler = () => {
        this.el.removeEventListener('animationend', handler, false)
        this.setFocusToFirstNode()
        this.afterChange(true)
      }
    } else {
      handler = () => {
        this.el.removeEventListener('animationend', handler, false)
        this.el.classList.remove('-isOpen')
        if (this.activeElement && this.activeElement.focus) {
          this.activeElement.focus()
        }
        this.afterChange(false)
      }
    }

    this.el.addEventListener('animationend', handler, false)
  }

  // eslint-disable-next-line class-methods-use-this
  afterChange() {}
}
