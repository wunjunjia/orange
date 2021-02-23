<template>
  <div
    :id="id"
    class="rich-text-wrapper"
  >
    <div
      class="rich-text-container"
      :style="{
        width: `${100 / zoom}%`,
        transform: `scale(${zoom})`,
      }"
    />
  </div>
</template>

<script>
import E from 'wangeditor'
import uuid from '@/utils/uid'
import styleTag from './mixins/styleTag'

export default {
  name: 'OrangeRichText',
  mixins: [styleTag],
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    lineHeight: {
      type: String,
      required: true,
    },
    margin: {
      type: String,
      required: true,
    },
    zoom: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      id: `rich-text-${uuid()}`,
      getInstance: null,
      styleEl: null,
    }
  },
  computed: {
    editor() {
      return this.getInstance()
    },
  },
  mounted() {
    this.getInstance = () => new E(this.$el.firstChild)
    this.editor.config.focus = false
    this.editor.config.placeholder = this.placeholder
    this.editor.config.onchange = (html) => {
      const index = html.lastIndexOf('<p>')
      this.$emit('change',
        html.substring(0, index).replace(/<p>/gim, `<p style="line-height: ${this.lineHeight}; margin: ${this.margin};">`) +
        html.substring(index).replace(/<p>/gim, `<p style="line-height: ${this.lineHeight}; margin: 0px;">`),
      )
    }
    this.editor.create()
    this.$emit('bootstrap', this)
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    selectAll() {
      this.editor.cmd.do('selectAll')
    },
    clearWindowSelectionRange() {
      this.editor.selection.clearWindowSelectionRange()
    },
    setContent(content) {
      this.editor.txt.html(content)
    },
  },
}
</script>

<style lang="less">
  .rich-text-wrapper {
    // 这里需要z-index的值，因为富文本的层级要比glass要高
    position: relative;
    z-index: 0;
  }

  .rich-text-container {
    transform-origin: 0 0;
  }

  .rich-text-container .w-e-toolbar {
    display: none;
  }

  .rich-text-container .w-e-text-container {
    height: auto !important;
    border: none !important;
    background-color: transparent;

    .w-e-text {
      padding: 0;

      p {
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    .placeholder {
      top: 0;
      left: 0;
      color: inherit;
      font-size: inherit;
      list-style: inherit;
    }
  }
</style>