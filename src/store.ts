import { EventEmitter } from 'events'

interface State {
  [x: string]: any;
}

class Store {
  private state = {}
  private stateObserver = new EventEmitter()
  constructor(state: State = {}) {
    this.state = state
  }

  getState(objKeys?: string): State {
    const state = { ...this.state }

    if (objKeys) {
      // @ts-ignore
      return objKeys.split('.').reduce((result, key) => result[key], state)
    }

    return state
  }

  commit(handler: (state: State) => State): State {
    const oldState = this.getState()
    const newState = handler(oldState)

    const mergedState = {
      ...oldState,
      ...newState,
    }

    this.state = mergedState

    this.stateObserver.emit('subscribe', {
      old: oldState,
      new: mergedState
    })

    return mergedState
  }

  module(key: string) {
    return {
      commit: (handler: (state: State) => any): State => {
        const newState = handler(this.getState())

        const mergedState = {
          ...this.getState(),
          [key]: newState
        }

        this.state = mergedState

        return mergedState
      }
    }
  }

  subscribe(handler: (state: State) => void): void {
    this.stateObserver.on('subscribe', handler)
  }
}

export { Store }