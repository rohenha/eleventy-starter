/**
 * Ajax Module to update content with a request form. You can customize it with Class extension to do what you need. Replace formItem with Data you need
 * @example
 * <div data-module-ajax-content>
 *    <form action="https://www.google.fr" data-ajax-content="form">
 *      <input type="text" name="test">
 *      <button submit data-ajax="submit">Récupérer les données</button>
 *    </form>
 *    <div data-ajax-content="content" data-content="contentId"></div>
 * </div>
 */
import Ajax from './_ajax'

export default class AjaxContent extends Ajax {
  constructor(m) {
    super(m)
    this.data = {}
    this.timeout = null
  }

  validateForm(form) {
    const formItem = form.get('formItem')
    const formItemData = this.data[formItem]
    this.formItemData = formItemData
    if (formItemData) {
      this.updateContent(formItemData)
      return false
    }
    return true
  }

  async afterUpdate(response) {
    if (response.status !== 200) {
      this.updating = false
      this.onError(response)
      return
    }

    const data = await response.json()
    clearTimeout(this.timeout)
    this.updating = false
    this.updateContent(data)
  }

  updateContent(content) {
    const contentEls = this.$('content')
    this.data[this.formItemData] = content
    contentEls.forEach((item) => {
      this.call('destroy', item, 'app')
      item.innerHTML = content[item.dataset.content]
      this.call('update', item, 'app')
    })
    this.call('updateLazy', null, 'Website', 'website')
  }

  onError() {
    const contentEls = this.$('content')
    contentEls.forEach((item) => {
      item.innerHTML = `<h3 class="a-h5 -txtupper -txtbold -clrprimaryl1">Aucun résultat</h3>`
    })
  }

  onUpdate() {
    this.timeout = setTimeout(() => {
      const contentEls = this.$('content')
      const loadingContent = `<div class="m-loaderSection">
        <div class="m-loaderSection__loader"><div></div><div></div><div></div><div></div></div>
      </div>`
      contentEls.forEach((item) => {
        item.innerHTML = loadingContent
      })
    }, 200)
  }
}
