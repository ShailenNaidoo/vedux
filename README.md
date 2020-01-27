---
title: Vedux.js - A lightweight Vuex alternative for Vue.js
description: A ultra-lightweight state management library for Vue.js, it just does enough to help you manage state without locking you in.
---

# Vedux

A ultra-lightweight state management library for Vue.js, it just does enough to help you manage state without locking you in.

Vedux is meant to be an alternative to Vuex as there is no such thing as `actions`, `mutations` or `getters`, you only have `state` that only gets mutated/accessed via the `setState()` and `getState()` functions. That's about it :)

You have full control over your state!

> NOTE: This is just an experiment and my personal opinion, if you have any thoughts please feel free to submit and issue

### Installation

```shell
$ yarn add veduxjs
```

```javascript
import Vue from 'vue'
import { Vedux, Store } from 'veduxjs'

const store = new Store({
  counter: 0, 
  form: {
    email: null,
    name: null,
  },
})

Vue.use(Vedux, { store })

new Vue({}).$mount('#app')
```

### Setup

After you have setup your `store`, you now have access to 4 methods:

* [`getState()`](#getstate) - Clones and returns the current instance of the `state` 
* [`setState()`](#setState) - Creates and returns a new instance of the state with your new values
* [`module()`](#module) - Allows you to create a module from a property on the state

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

#### `setState()`

```javascript
const { counter: currentCounter } = store.getState() // currentCounter: 0

const { counter: newCounter } = store.setState(({ counter }) => ({ 
  counter: counter + 5
})) // newCounter: 5
``` 

#### `module()`

```javascript
const counterModule = store.module('counter')

const { counter } = counterModule.setState(({ counter }) => counter + 5)

console.log(counter) // 5
```

### Using it with Vue components

Just like Vuex, now you have access to the Vedux store with `$store` key, here is a simple example of how you can share state amongst 2 components

:::tip
Vedux uses `Vue.observable` under the hood
:::

**store**

```javascript
const store = new Store({ text: null })

Vue.use(Vedux, { store })

new Vue({}).$mount('#app')
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
    updateText(newText) {
      const textModule = this.$store.module('text')

      textModule.setState(() => newText)
    }
  }
}
</script>
```
