# Vedux

A ultra-lightweight state management library for Vue.js, it just does enough to help you manage state without locking you in. The issue with Vuex is that it's hard not to put your business logic into it so if you wanted to changed framework your business logic ends up stuck in there with all the conventions of Vuex.

Vedux is meant to be an alternative to that as there is no such thing as `actions`, `mutations` or `getters`, you only have `state` that only gets mutated/accessed via the `commit()` and `getState()` functions. That's about it :)

You have full control over your state!

> NOTE: This is just an experiment :)

### Installation

```shell
$ yarn add veduxjs
```

```javascript
import Vue from 'vue'
import { Vedux, Store } from 'veduxjs'

Vue.use(Vedux)

const store = new Store({ 
  counter: 0, 
  form: {
    email: null,
    name: null,
  },
})

new Vue({
  store,
}).$mount('#app')

```

### Setup

After you have setup your `store`, you now have access to 4 methods:

* `getState()` - Clones and returns the current instance of the `state` 
* `commit()` - Creates and returns a new instance of the state with your new values
* `module()` - Allows you to create a module from a property on the state
* `subscribe()` - You can observe changes in the state

#### `getState()`

```javascript
const cloneOfTheState = store.getState()

// cloneOfTheState: { counter: 0, form: { email: null, name: null } }

const cloneOfTheState = store.getState('form')

// cloneOfTheState: { email: null, name: null }

const cloneOfTheState = store.getState('form.email')

// cloneOfTheState: null

const cloneOfTheState = store.getState(['form', 'email'])

// cloneOfTheState: null
```

#### `commit()`

```javascript
const { counter: currentCounter } = store.getState() // currentCounter: 0

const { counter: newCounter } = store.commit(({ counter }) => ({ 
  counter: counter + 5
})) // newCounter: 5
``` 

#### `module()`

```javascript
const counterModule = store.module('counter')

const { counter } = counterModule.commit(({ counter }) => counter + 5)

console.log(counter) // 5
```

#### `subscribe()`

```javascript
store.subscribe(({ oldState, newState }) => {
  console.log(oldState, newState)
  // oldState: { counter: 0 }
  // newState: { counter: 10 }
})

store.commit(() => ({ counter: 10 }))
```

### Using it with Vue components

Just like Vuex, now you have access to the Vedux store with `$store` key, here is a simple example of how you can share state amongst 2 components

**store**

```javascript
const store = new Store({ text: null })

new Vue({
  store
}).$mount('#app')
```
**text component**
```vue
<template>
  <p>
    {{ text }}
  </p>
</template>

<script>
export default {
  computed: {
    text() {
      return this.$store.getState('text')
    }
  }
}
</script>
```
**input component**

```vue
<template>
  <input :value="text" @input="updateText" type="text">
</template>

<script>
export default {
  computed: {
    text() {
      return this.$store.getState('text')
    }
  },
  methods: {
    updateText(e) {
      const textModule = this.$store.module('text')

      const newState = textModule.commit(() => e)

      console.log(newState)
    }
  }
}
</script>
```
