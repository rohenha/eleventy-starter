import { module as mmodule } from 'modujs'

export default class Styleguide extends mmodule {
  constructor(m) {
    super(m)
    this.state = false
    this.open = this.change.bind(this, true)
    this.close = this.change.bind(this, false)
    this.toast = null
    this.events = {
      click: 'onClick',
      // click: {
      //   button: 'toggle',
      //   // nav: 'onClick',
      //   content: 'onClick',
      //   overlay: 'close',
      // },
    }
  }

  onClick(e) {
    const { target } = e

    const { action } = target.dataset

    if (action && this[action]) {
      this[action](target)
    }
  }

  toggle() {
    this.change(!this.state)
  }

  change(state) {
    if (this.state === state) {
      return
    }

    this.state = state
    const [aside] = this.$('aside')
    const [overlay] = this.$('overlay')
    const [button] = this.$('button')
    aside.style.transform = `translateX(${state ? 100 : 0}%)`
    overlay.style.display = state ? 'block' : 'none'
    button.innerText = state ? 'Close' : 'Menu'
  }

  async copy(target) {
    const toCopy = target.dataset.copy
    if (window.navigator.clipboard && window.isSecureContext) {
      await window.navigator.clipboard.writeText(toCopy)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = toCopy

      // Move the textarea outside the viewport to make it invisible
      textarea.style.position = 'absolute'
      textarea.style.left = '-99999999px'

      document.body.prepend(textarea)

      // highlight the content of the textarea element
      textarea.select()

      try {
        document.execCommand('copy')
        this.addCopyToast(toCopy)
      } catch (err) {
        console.log(err)
      } finally {
        textarea.remove()
      }
    }
  }

  addCopyToast(text) {
    clearTimeout(this.toastTimeout)

    if (this.toast) {
      const textEl = this.toast.querySelector('p')
      textEl.innerText = text
    } else {
      const toast = document.createElement('div')
      toast.setAttribute('class', 't-styleguide__toast')
      toast.setAttribute('data-action', 'removeCopyToast')
      const toastLabel = document.createElement('h3')
      toastLabel.innerText = 'Texte copié'
      const toastText = document.createElement('p')
      toastText.innerText = text
      toast.append(toastLabel)
      toast.append(toastText)
      this.el.append(toast)
      this.toast = toast
    }

    this.toastTimeout = setTimeout(this.removeCopyToast.bind(this), 5000)
  }

  removeCopyToast() {
    clearTimeout(this.toastTimeout)
    this.toast.remove()
    this.toast = null
  }
}
