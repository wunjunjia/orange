<template>
  <color-picker
    :value="store.color"
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'TextColor',
  inject: ['store'],
  methods: {
    onInput(value) {
      this.store.color = value
    },
  },
}
</script>
