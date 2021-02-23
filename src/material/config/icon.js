import Icon from '../constructors/icon'

export const icon = {
  'outlined-icon': new Icon({
    id: 'outlined-icon',
    component: {
      style: {
        width: '18px',
        height: '18px',
        color: 'rgb(24, 144, 255)',
      },
      props: {
        type: 'star',
        theme: 'outlined',
      },
    },
  }),
  'filled-icon': new Icon({
    id: 'filled-icon',
    component: {
      style: {
        width: '18px',
        height: '18px',
        color: 'rgb(24, 144, 255)',
      },
      props: {
        type: 'star',
        theme: 'filled',
      },
    },
  }),
  'twoTone-icon': new Icon({
    id: 'twoTone-icon',
    component: {
      style: {
        width: '18px',
        height: '18px',
      },
      props: {
        type: 'star',
        theme: 'twoTone',
        twoToneColor: 'rgb(24, 144, 255)',
      },
    },
  }),
}