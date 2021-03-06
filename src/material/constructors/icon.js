import * as R from 'ramda'
import Base from './base'

export class Icon extends Base {
  constructor(dataSource) {
    super(R.mergeDeepRight({
      is: 'a-icon',
      props: {
        editable: {
          text: false,
          border: false,
          icon: true,
          stretch: true,
          move: true,
          event: true,
        },
      },
      container: {
        style: {
          fontSize: 0,
        },
      },
      component: {
        style: {
          width: '18px',
          height: '18px',
          color: 'rgb(24, 144, 255)',
        },
        props: {
          type: 'star',
          twoToneColor: 'rgb(24, 144, 255)',
        },
      },
      __constructor__: 'Icon',
    }, dataSource))

    this.on('color', (value) => {
      const { component } = this
      component.props.twoToneColor = value
    })
  }

  compile() {
    const {
      id,
      container,
      component,
    } = this
    return {
      id,
      is: 'a-icon',
      props: {
        style: Object.assign({}, container.style, component.style),
        ...component.props,
      },
      events: {},
      children: [],
    }
  }
}
