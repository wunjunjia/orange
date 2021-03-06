import vuexStore from '@/store'
import materialStore from '@/material/store'
import { noop } from '@/utils'
import MenuItem from '@/components/menu/constructors/menuItem'
import {
  TO_TOP,
  TO_BOTTOM,
  ADD_WIDGET,
  DELETE_WIDGET,
} from '@/material/store/mutation-types'

export default () => {
  const cut = new MenuItem({
    title: '剪切',
    key: 'cut',
    events: {
      click() {
        materialStore.emit(DELETE_WIDGET, {
          log: {
            source: 'mouseWidget -> mixins -> menu -> config -> cut',
            reason: '剪切操作删除组件',
          },
          widget: this.menu.dataSource,
        })
      },
    },
  })

  const copy = new MenuItem({
    title: '复制',
    key: 'copy',
  })

  const paste2canvas = new MenuItem({
    title: '到画布',
    key: 'paste2canvas',
    events: {
      click() {
        // 由于paste2canvas和paste2mouse都是用paste的dataSource，所以这里需要用paste.dataSource的副本
        const widget = paste.dataSource.widget.clone()
        const { position: { top, left } } = paste.dataSource
        widget.container.style.top = `${top}px`
        widget.container.style.left = `${left}px`
        materialStore.emit(ADD_WIDGET, {
          widget,
          log: {
            source: 'mouseWidget -> mixins -> menu -> config -> paste2canvas',
            reason: '新增组件',
          },
        })
      },
    },
  })

  const paste2mouse = new MenuItem({
    title: '到鼠标位置',
    key: 'paste2mouse',
    events: {
      click() {
        const { event } = this.menu
        const {
          target,
          offsetX,
          offsetY,
        } = event
        // 由于paste2canvas和paste2mouse都是用paste的dataSource，所以这里需要用paste.dataSource的副本
        const widget = paste.dataSource.widget.clone()
        const { style } = widget.container
        // 当粘贴的触发时机是发生在某个组件内部时，offsetX和offsetY的值是相对与组件的，而非画布，那么就会有问题
        let top = 0
        let left = 0
        if (target[target.id]) {
          const position = target[target.id].position2canvas()
          top = position.top
          left = position.left
        }
        // top和left值已经是根据符合当前画布缩放因子的位置，
        // 所以添加这个组件的时候就不需要在进行位置调整了
        style.top = top + offsetY + 'px'
        style.left = left + offsetX + 'px'
        materialStore.emit(ADD_WIDGET, {
          log: {
            source: 'mouseWidget -> mixins -> menu -> config -> paste2mouse',
            reason: '新增组件',
          },
          widget,
        })
      },
    },
  })

  const paste = new MenuItem({
    title: '粘贴',
    key: 'paste',
    props: {
      disabled: true,
    },
    dataSource: {
      widget: null,
      position: null,
      unwatch: noop,
    },
    init() {
      const fn = () => {
        this.dataSource.unwatch()
        const position = this.menu.dataSource.position2canvas()
        // 注意这里不要直接复制dataSource，而应该时dataSource的副本
        const widget = this.menu.dataSource.clone()
        // 当前的粘贴都是将组件直接添加到画布中，暂不支持添加到组件内，所以需要将parent指向设置为null
        widget.parent = null
        const unwatch = vuexStore.watch((state) => state.canvas.zoom, (zoom) => {
          const prev = widget.zoom
          const percent = zoom / prev
          widget.zoom = zoom
          const { top, left } = position
          position.top = Math.floor(top * percent)
          position.left = Math.floor(left * percent)
        })
        this.dataSource = {
          widget,
          position,
          unwatch,
        }
        this.props.disabled = false
      }
      cut.on('click', fn)
      copy.on('click', fn)
    },
    children: [
      paste2canvas,
      paste2mouse,
    ],
    destroy() {
      this.dataSource.unwatch()
    },
  })

  const remove = new MenuItem({
    title: '删除',
    key: 'remove',
    divider: true,
    events: {
      click() {
        materialStore.emit(DELETE_WIDGET, {
          log: {
            source: 'mouseWidget -> mixins -> menu -> config -> remove',
            reason: '删除组件',
          },
          widget: this.menu.dataSource,
        })
      },
    },
  })

  const toTop = new MenuItem({
    title: '置顶',
    key: 'toTop',
    events: {
      click() {
        materialStore.emit(TO_TOP, {
          log: {
            source: 'mouseWidget -> mixins -> menu -> config -> toTop',
            reason: '修改组件的zIndex值',
          },
          widget: this.menu.dataSource,
        })
      },
    },
  })

  const toBottom = new MenuItem({
    title: '置底',
    key: 'toBottom',
    events: {
      click() {
        materialStore.emit(TO_BOTTOM, {
          log: {
            source: 'mouseWidget -> mixins -> menu -> config -> toBottom',
            reason: '修改组件的zIndex值',
          },
          widget: this.menu.dataSource,
        })
      },
    },
  })

  return {
    cut,
    copy,
    paste,
    remove,
    toTop,
    toBottom,
  }
}
