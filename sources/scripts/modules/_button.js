/**
 * Button Module to call au module onclick
 * @example
 * <button data-module-button data-action="click,ModuleName,moduleId">Click Here</button>
 */
import { module as mmodule } from 'modujs'

export default class ButtonModule extends mmodule {
  constructor(m) {
    super(m)
    this.events = {
      click: 'onClick',
    }
  }

  onClick() {
    const fnc = this.el.dataset.action.split(',')
    const options = {
      el: this.el,
    }

    this.call(fnc[0], options, fnc[1], fnc[2])
  }
}
