import Vue from 'vue'

// drag
export const WIDGET_DRAG_START = 'WIDGET_DRAG_START'
export const WIDGET_DRAG_END = 'WIDGET_DRAG_END'

// mouseWidget
export const CANVAS_WIDGET_RESIZE = 'CANVAS_WIDGET_RESIZE'
export const CANVAS_WIDGET_MOUSEDOWN = 'CANVAS_WIDGET_MOUSEDOWN'
export const CANVAS_WIDGET_RESIZER_VISIBLE = 'CANVAS_WIDGET_RESIZER_VISIBLE'

// document
export const DOCUMENT_MOUSE_DOWN = 'DOCUMENT_MOUSE_DOWN'
export const DOCUMENT_MOUSE_MOVE = 'DOCUMENT_MOUSE_MOVE'
export const DOCUMENT_MOUSE_UP = 'DOCUMENT_MOUSE_UP'
export const DOCUMENT_CONTEXT_MENU = 'DOCUMENT_CONTEXT_MENU'

// screen
export const SCREEN_SCROLL = 'SCREEN_SCROLL'
export const SCREEN_SCROLL_END = 'SCREEN_SCROLL_END'

// apperance and event
export const APPERANCE_EVENT_DATASOURCE = 'APPERANCE_EVENT_DATASOURCE'

const bus = new Vue()

export default {
  $on: (event, callback) => {
    bus.$on(event, callback)
    return () => {
      bus.$off(event, callback)
    }
  },
  $off: (...args) => {
    bus.$off(...args)
  },
  $emit: (...args) => {
    bus.$emit(...args)
  },
}
