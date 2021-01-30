### 可视化构建表单


### 踩坑
1. 子组件的`mounted`执行时机优先于父组件的`mounted`,所以父组件需要在`created`钩子执行`Bus.$on`,这样子组件在`mounted`执行`Bus.$emit`的时候才会触发绑定的事件

### 优化
1. 标线距离显示待优化
2. 吸附逻辑待优化，目前是根据线的`isAdsorb`决定是否进行吸附，这样会导致当有两个相邻节点时，与其中一个吸附之后，那么另一个很可能就不会触发吸附效果了, 另一个是鼠标的位置看是否能更改
3. 快捷键
4. 悬浮菜单子菜单过渡效果与主菜单保持一致
5. 标尺位置迁移到画布中

### 待开发功能
1. 组件旋转，涉及resizer, markline等功能逻辑调整
2. 画布拖拽移动

### 遗留问题
1. hoverMenu下的config.js中声明的变量看是否需要在指定时机销毁

### 内存泄漏问题
1. `screen`的`bootstrap`方法通过闭包的方式把`target`指向的对象保留了下来，在快照的重做撤销操作会用到，快照的保留的历史记录是有限制的，另外当快照队列是`[a, b, c, d]`时，我们回退两次，`step`指向`b`，这时候我们进行操作`e`，这时候`c`,`d`会被弹出，然后在插入`e`,这两种情况下我们应该需要手动把闭包变量的指向置为`null`，避免内存泄漏。
解决方案：给快照添加一个`free`方法，当快照被删除的时候调用这个方法就行。
2. 当快照是拖入组件产生的，那么需要注意手动调用组件的`$destroy`的方法将其释放掉。
解决方案：当`mouseWidget`组件`mounted`的时候，会派发`bootstrap`方法，将`vm`实例作为参数传出去，当快照的`free`方法被调用时，会执行`vm.$destroy`方法将其释放掉

### 脚本
1. 文件格式化：`orange/node_modules/ant-design-vue/scripts/prettier.js`

### ant-design配置
1. `a-sub-menu`可以通过配置`popup-offset`属性更改子菜单弹窗的位置，值是一个数组，如`[0, -4]`

### 知识点
1. 如果判断鼠标右键事件
  监听`mousedown`,根据`evt.button`或者`evt.which`的值进行判断
2. 禁用鼠标右键弹窗
  监听`contextmenu`事件，调用`evt.preventDefault()`即可
