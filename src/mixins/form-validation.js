export default {
  methods: {
    hasFieldError (formStateKey, nameKey) {
      if (this[formStateKey] && this[formStateKey].$submitted) {
        if (this[formStateKey][nameKey] && this[formStateKey][nameKey].$invalid) {
          return true
        }
      }
      return false
    }
  }
}
