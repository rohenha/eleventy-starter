
export default {
    dateToFormat: function (date) {
        return new Date(date).toLocaleString()
    },
    url: function (url) {
      return this.context.meta.url + url
    },
}
