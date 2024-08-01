import { html } from './environment'

export function hasTouchEvent() {
  return ( 'ontouchstart' in window ) ||
    // eslint-disable-next-line no-undef
    ( navigator.maxTouchPoints > 0 ) ||
    // eslint-disable-next-line no-undef
    ( navigator.msMaxTouchPoints > 0 );
}

/**
* description
*
* @method transitionCSS
* @access accessType (ex: public, private)
* @param { { name: string, start: function, complete: function } } options
* @returns { returnType }
* @example
*
*/
export function transitionCSS({
  name,
  params = null,
  start = () => {},
  complete = () => {}
}) {
  return new Promise((resolve) => {
    const afterTransition = (e) => {
      const targetEventName = e.target.dataset.transitionName
      if (targetEventName !== name) {
        return
      }
      window.requestAnimationFrame(() => {
        complete()
      })
      html.removeEventListener('transitionend', afterTransition)
      resolve(params)
    }

    window.requestAnimationFrame(() => {
      start()
    })

    html.addEventListener('transitionend', afterTransition)
  })
}
