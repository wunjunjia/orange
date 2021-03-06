import factory from './config'
import base, { MENU_INSTANCE } from '@/components/menu/hoverMenu/mixins/base'

export default {
  mixins: [base],
  data() {
    return {
      config: null,
    }
  },
  mounted() {
    this.config = factory()
  },
  methods: {
    contextmenu(evt) {
      const { target } = evt
      if (!target.dataset.hovermenu) return
      const widget = target[target.id]
      // 设置数据源
      const menu = this[MENU_INSTANCE]
      const { cut, copy, paste, remove, toTop, toBottom } = this.config
      let items = null
      if (widget) items = [cut, copy, paste, remove, toTop, toBottom]
      else items = [paste]
      menu.setData({
        items,
        dataSource: widget,
        event: evt,
      })
      // 显示悬浮菜单
      this.$refs.hoverMenu.setData({
        menus: menu.items,
        position: {
          top: evt.clientY,
          left: evt.clientX,
        },
      })
    },
  },
}
