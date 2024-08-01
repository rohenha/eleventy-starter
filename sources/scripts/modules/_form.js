import { module as mmodule } from 'modujs'
import { setScript } from '@scripts/utils/tools'

export default class Form extends mmodule {
  constructor(m) {
    super(m)
    this.errors = {}
    this.state = false
    this.containerScroll = window
    this.loading = false
    this.timeouts = []
    this.events = {
      click: {
        submit: 'onSearch',
      },
    }
  }

  init() {
    setTimeout(() => {
      this.createRecaptchaScript()
    }, 2000)
  }

  destroy() {
    clearInterval(this.interval)
  }

  /**
   * Inject Captcha script
   * @method createRecaptchaScript
   * @access public
   * @returns {void}
   */
  createRecaptchaScript() {
    const [recaptchaInput] = this.$('recaptcha')
    this.recaptchaKey = recaptchaInput.dataset.key
    recaptchaInput.removeAttribute('data-key')

    if (!this.recaptchaKey) {
      return
    }

    const newScript = setScript(
      `https://www.google.com/recaptcha/api.js?render=${this.recaptchaKey}`,
      {
        id: 'recaptcha-id',
      },
    )

    newScript.onload = () => {
      grecaptcha.ready(() => {
        this.initRecaptcha()
      })
    }
  }

  /**
   * Init Recaptcha call on Submit
   * @method initRecaptcha
   * @access public
   * @returns {void}
   */
  initRecaptcha() {
    this.interval = setInterval(this.setRecaptcha.bind(this), 119 * 1000)
    this.setRecaptcha()
  }

  /**
   * Generate new token for Recaptcha
   *
   * @method setRecaptcha
   * @access public
   * @returns {void}
   */
  setRecaptcha() {
    const [recaptchaInput] = this.$('recaptcha')
    grecaptcha
      .execute(this.recaptchaKey, {
        action: 'homepage',
      })
      .then((token) => {
        recaptchaInput.value = token
      })
  }

  /**
   * method to handle the form submission
   * @method onSearch
   * @access public
   * @param {Event} e - event object
   * @returns {void}
   *
   */
  onSearch(e) {
    if (this.disabledSubmit) {
      e.preventDefault()
      return
    }
    this.disabledSubmit = true
    window.requestAnimationFrame(() => {
      this.clearCallbacks()
      e.currentTarget.setAttribute('aria-disabled', 'true')
    })
    e.currentTarget.blur()
    if (this.el.checkValidity()) {
      e.preventDefault()
      this.sendForm(this.el)
    }
  }

  /**
   * method to submit the form
   * @method sendForm
   * @access public
   * @param {HTMLFormElement} form - form element
   * @returns {void}
   *
   */
  sendForm(form) {
    this.cleanErrors()
    window.requestAnimationFrame(() => {
      this.el.classList.add('-loading')
    })
    this.loading = true
    this.state = null

    fetch(form.action, {
      method: 'POST',
      responseType: 'json',
      body: new FormData(this.el),
    })
      .then(async (response) => {
        const data = await response.json()
        this.formSent(data)
      })
      .catch((error) => {
        this.errorForm(error)
      })
  }

  /**
   *
   * Method to add a new Callback
   * @method setCallback
   * @param {String} message
   * @param {Boolean} success
   */
  setCallback(message, success) {
    const callbackMessage = document.createElement('div')
    callbackMessage.setAttribute('class', 'm-formCallback')

    callbackMessage.innerHTML = `<p class="tx-pxsmall">${message}</p><div class="a-cross"></div>`

    // message type identification
    if (success) {
      this.resetInput()
      callbackMessage.classList.add('-success')
    } else {
      callbackMessage.classList.add('-error')
    }
    window.requestAnimationFrame(() => {
      this.el.appendChild(callbackMessage)
      this.el.classList.remove('-loading')
    })
    callbackMessage.addEventListener(
      'click',
      this.clearCallback.bind(this, callbackMessage),
    )
    this.timeouts.push({
      el: callbackMessage,
      timeout: setTimeout(
        this.clearCallback.bind(this, callbackMessage),
        15000,
      ),
    })
  }

  /**
   * Method to clear a single callback
   * @method clearCallback
   * @access public
   * @returns {void}
   */
  clearCallback(el) {
    const index = this.timeouts.findIndex((timeoutEl) => timeoutEl.el === el)
    if (index === -1) {
      return
    }
    const timeout = this.timeouts[index]
    clearTimeout(timeout.timeout)
    window.requestAnimationFrame(() => {
      timeout.el.classList.add('-leave')
    })
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        timeout.el.remove()
      })
    }, 700)
    this.timeouts.splice(index, 1)
  }

  /**
   * Method to clear all callbacks
   * @method clearCallbacks
   * @access public
   * @returns {void}
   */
  clearCallbacks() {
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout.timeout)
      window.requestAnimationFrame(() => {
        timeout.el.remove()
      })
    })
    this.timeouts = []
  }

  /**
   * Method to clean the errors
   * @method cleanErrors
   * @access public
   * @returns {void}
   */
  cleanErrors() {
    const errors = this.$('invalid')
    errors.forEach((error) => {
      window.requestAnimationFrame(() => {
        const parent = error.parentNode
        parent.classList.remove('-error')
        error.remove()
      })
    })
  }

  /**
   * Method to control data after success submission
   * @method formSent
   * @access public
   * @param {Object} data - response data
   * @returns {void}
   */
  formSent(data) {
    if (data.invalid) {
      this.errorForm(data)
      return
    }
    this.state = true
    this.setCallback(data.message, data.sent)
    this.enableForm()
    this.setRecaptcha()
  }

  /**
   * Method to control data after error submission
   * @method errorForm
   * @access public
   * @param {Object} data - response data
   * @returns {void}
   */
  errorForm(data) {
    this.setCallback(data.message, data.success)
    this.state = false
    this.setRecaptcha()
    this.enableForm()
    if (data.invalid) {
      this.setErrors(data.invalid)
    }
  }

  /**
   * Method to set the errors in the form
   * @method setErrors
   * @param {[{key: String, value: String|Number}]} invalid
   */
  setErrors(invalid) {
    this.errors = invalid
    const elements = Array.from(Object.entries(invalid))
    elements.forEach(([key, value]) => {
      const el = this.$(key)[0]
      if (el) {
        const errorEl = document.createElement('p')
        errorEl.innerHTML = value
        el.classList.add('-error')
        errorEl.setAttribute('class', 'a-pxsmall a-inputField__error')
        errorEl.setAttribute(this.mAttr, 'invalid')
        window.requestAnimationFrame(() => {
          el.append(errorEl)
        })
      }
    })
  }

  /**
   * Method to enable the form after submission and callback
   * @method enableForm
   * @access public
   * @returns {void}
   */
  enableForm() {
    window.requestAnimationFrame(() => {
      this.$('submit')[0].removeAttribute('aria-disabled', 'false')
    })
    this.disabledSubmit = false
  }

  /**
   * Reset all inputs after successfull submission
   * @method resetInput
   * @access public
   * @returns {void}
   */
  resetInput() {
    const allInputs = this.el.querySelectorAll('input, textarea, select')
    allInputs.forEach((input) => {
      if (input.type === 'hidden') {
        return
      }
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.checked = false
        return
      }
      input.value = ''
    })
  }
}
