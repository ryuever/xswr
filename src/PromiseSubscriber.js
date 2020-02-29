let count = 0

import ResumablePromise from "./ResumablePromise"

export default class PromiseSubscriber {
  constructor({fetcher, scope}) {
    this.id = `promise_subscriber_${count++}`
    this.fetcher = fetcher
    this.scope = scope
    this.scope.bind(this)
    this.remover = null
    this.promise = new ResumablePromise()

    this.fetcher.handlePromise(this)
  }

  resolve(result) {
    if (!this.scope.assertResultEqual(result)) {
      this.scope.usedData = result
      this.promise.resolve(result)
    }
  }

  reject(err) {
    if (!this.scope.assertErrorEqual(err)) {
      this.promise.resolve(err)
    }

    this.scope.attemptToRetry()
  }

  validate() {
    this.fetcher.handlePromise(this)
  }

  teardown() {
    if (typeof this.remover === "function") {
      this.remover()
    }
    this.remover = null
  }
}
