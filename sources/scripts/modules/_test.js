import { module as mmodule } from 'modujs'

export default class Test extends mmodule {
  constructor(m) {
    super(m)
    console.log('Test module');
    this.initialized = false
  }

  initModule() {
    if (this.initialized) {
      return
    }
    console.log('initModule Test');
    this.initialized = true
  }

  enter() {
    this.initModule()
    console.log('enter Test');
  }

  leave() {
    if (!this.initialized) {
      return
    }
    console.log('leave Test');
  }

  toggle({ way }) {
    if (way === 'enter') {
      this.enter()
    } else {
      this.leave()
    }
  }
}
