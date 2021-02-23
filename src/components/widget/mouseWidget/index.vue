<template>
  <widget
    ref="widget"
    :data-source="dataSource"
  >
    <mouse-widget
      v-for="widget in dataSource.children"
      :key="widget.id"
      :data-source="widget"
    />
  </widget>
</template>

<script>
import { on, off } from '@/utils/dom'
import { leftMousedown } from '@/utils/check'
import { setTarget } from '@/lib/document'
import Bus, {
  DOCUMENT_MOUSE_UP,
  CANVAS_WIDGET_MOUSEDOWN,
} from '@/utils/bus'
import menu from './mixins/menu'
import Widget from '@/components/widget'

export default {
  name: 'MouseWidget',
  components: {
    Widget,
  },
  mixins: [menu],
  props: {
    dataSource: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // 绑定获取vm实例的方法
    this.dataSource.container.emit('bootstrap', { vm: this.$refs.widget })
    this.addEventListener()
  },
  beforeDestroy() {
    this.removeEventListener()
  },
  methods: {
    mousedown(evt) {
      // 只有鼠标左键点击的情况下才触发
      if (!leftMousedown(evt)) return
      // 由于事件冒泡机制这里需要加判断
      if (evt.target !== this.$el) return
      const target = evt.target
      target.position = {
        startX: target.offsetLeft,
        startY: target.offsetTop,
        clientX: evt.clientX,
        clientY: evt.clientY,
      }
      setTarget(target)
      Bus.$emit(CANVAS_WIDGET_MOUSEDOWN)
      Bus.$on(DOCUMENT_MOUSE_UP, this.mouseup)
    },
    mouseup(target, move) {
      // 移除DOCUMENT_MOUSE_UP监听事件
      Bus.$off(DOCUMENT_MOUSE_UP, this.mouseup)
      // 如果没有移动过那么不添加快照
      if (!move) return
      // 更新widget信息和添加快照
      const {
        style: { top, left },
        position: { startX, startY },
      } = target
      // 保留添加快照时缩放因子的值
      const prev = this.dataSource.zoom
      this.dataSource.container.emit('snapshot', {
        log: {
          source: 'mouseWidget -> mouseup',
          reason: '移动组件后修改样式并添加快照',
        },
        update: ({ widget: { container: { style } } }) => {
          style.top = top
          style.left = left
        },
        snapshot: {
          undo: ({ widget: { zoom, container: { style } } }) => {
            const percent = zoom / prev
            style.top = Math.floor(startY * percent) + 'px'
            style.left = Math.floor(startX * percent) + 'px'
          },
          redo: ({ widget: { zoom, container: { style } } }) => {
            const percent = zoom / prev
            style.top = Math.floor(parseInt(top, 10) * percent) + 'px'
            style.left = Math.floor(parseInt(left, 10) * percent) + 'px'
          },
        },
      })
    },
    addEventListener() {
      const el = this.$el
      on(el, 'mousedown', this.mousedown)
    },
    removeEventListener() {
      const el = this.$el
      off(el, 'mousedown', this.mousedown)
    },
  },
}
</script>