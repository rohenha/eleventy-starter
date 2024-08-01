/**
 * Ajax Module to query content with a request form. You can customize it with Class extension to do what you need
 * @example
 * <div data-module-ajax>
 *    <form action="https://www.google.fr" data-ajax="form">
 *      <input type="text" name="test">
 *      <button submit data-ajax="submit">Récupérer les données</button>
 *    </form>
 * </div>
 */
/* eslint-disable class-methods-use-this */
import { module as mmodule } from 'modujs'

export default class Ajax extends mmodule {
  constructor(m) {
    super(m)

    this.updating = false
    this.events = {
      click: {
        submit: 'onSubmit',
      },
    }
  }

  /**
   * Function to generate url to fetch (overridable)
   *
   * @method getAction
   * @param url is the form action link
   * @param form is the form data with all data from form
   * @returns string
   */
  getAction(url) {
    return url
  }

  /**
   * Function validate form. It can be use to check if form is good to fetch or not (overridable)
   *
   * @method validateForm
   * @param form is the form data with all data from form
   * @returns boolean
   */
  validateForm() {
    return true
  }

  onSubmit(e) {
    e.preventDefault()
    this.update()
  }

  /**
   * Function called to query content
   *
   * @method update
   * @returns undefined
   */
  update() {
    if (this.updating) {
      return
    }
    this.updating = true
    const [form] = this.$('form')
    const formData = new FormData(form)
    if (!this.validateForm(formData)) {
      this.updating = false
      return
    }
    this.onUpdate()
    fetch(this.getAction(form.action, formData), {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'fetch',
      },
    })
      .then(this.afterUpdate.bind(this))
      .catch(this.onError.bind(this))
  }

  /**
   * Function to use fetch response (overridable)
   *
   * @method afterUpdate
   * @param response is the response from the fetch
   * @returns undefined
   */
  async afterUpdate(response) {
    // eslint-disable-next-line no-unused-vars
    const data = await response.json()
    console.log(data)
    this.updating = false
  }

  /**
   * Function in case there is an error
   *
   * @method onError
   * @param error is the response error from the fetch
   * @returns undefined
   */
  onError(error) {
    console.log(error)
  }

  /**
   * Function to do what you want when update
   *
   * @method onUpdate
   * @returns undefined
   */
  onUpdate() {}
}
