const plugin = require('tailwindcss/plugin')

module.exports = {
  corePlugins: {
    container: false,
  },
  purge: [
    './frontend/components/**/*.ts',
    './frontend/components/**/*.tsx',
    './app/views/**/*.erb'
  ],
  theme: {
    colors: {
      'transparent': 'transparent',
      'black': '#000000',
      'black-admin': '#31385C',
      'white': '#FFFFFF',
      'primary': '#08C4B3',
      'primary-light': '#E2F9F7',
      'red': '#FF6666',
      'green': '#63C146',
      'blue': '#4391ED',
      'orange': '#FFA747',
      'yellow': '#FBD300',
      // TODO
      'neutral-900': '#111111', // header / footer
      'neutral-800': '#333333', // text
      'neutral-700': '#2A2A2A', // footer
      'neutral-670': '#7C7C7C', // text-gray
      'neutral-650': '#666666', // text-gray TODO: organize colors
      'neutral-600': '#ADB5BD', // icon fill
      'neutral-500': '#B5B5B5', // placeholder
      'neutral-400': '#D6D6D6', // muted button
      'neutral-300': '#EAEDEF', // border
      'neutral-200': '#F7F7FA', // sidebar
      'neutral-100': '#F7F7F7', // bg-body
    },
    zIndex: {
      '-1': '-1',
      '1': '1',
      '9': '9',
      '10': '10',
      '11': '11',
      '50': '50',
      '60': '60',
      '80': '80',
      '99': '99',
    },
    fontFamily: {
      'sans': [
        '-apple-system',
        'BlinkMacSystemFont',
        '"ヒラギノ角ゴ ProN W3"',
        '"Hiragino Kaku Gothic ProN W3"',
        'HiraKakuProN-W3',
        '"ヒラギノ角ゴ ProN"',
        '"Hiragino Kaku Gothic ProN"',
        '"ヒラギノ角ゴ Pro"',
        '"Hiragino Kaku Gothic Pro"',
        '"メイリオ"',
        'Meiryo',
        'Osaka',
        '"ＭＳ Ｐゴシック"',
        '"MS PGothic"',
        '"Helvetica Neue"',
        'HelveticaNeue',
        'Helvetica',
        'Arial',
        '"Segoe UI"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ]
    },
    extend: {
      spacing: {
        '0': '0',
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '6px': '6px',
        ...[9, 15, 72, 80, 88, 96, 104, 112, 120].reduce((acc, cur) => {
          acc[cur] = `${cur * 0.25}rem`
          return acc
        }, {}),
        'full': '100%',
        '50vh': '50vh',
      },
      width: {
        ...[15, 16, 18, 22, 25, 28, 30, 32, 34, 42, 50, 57, 60, 64, 74, 76, 80, 90, 120].reduce((acc, cur) => {
          acc[cur] = `${cur * 0.25}rem`
          return acc
        }, {}),
        '1/7': `${(100 / 7)}%`,
      },
      height: {
        ...[13, 16, 17, 28, 42, 44, 48, 50, 60, 90, 130, 135].reduce((acc, cur) => {
          acc[cur] = `${cur * 0.25}rem`
          return acc
        }, {}),
      },
      minWidth: {
        ...[3, 4, 23].reduce((acc, cur) => {
          acc[cur] = `${cur * 0.25}rem`
          return acc
        }, {})
      },
      maxWidth: {
        ...[15, 48, 64, 80, 90, 100, 115, 165].reduce((acc, cur) => {
          acc[cur] = `${cur * 0.25}rem`
          return acc
        }, {}),
        '1/2': '50%',
      },
      minHeight: {
        ...[10, 36].reduce((acc, cur) => {
          acc[cur] = `${cur * 0.25}rem`
          return acc
        }, {})
      },
      maxHeight: {
        ...[30, 40, 60].reduce((acc, cur) => {
          acc[cur] = `${cur * 0.25}rem`
          return acc
        }, {})
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #08C4B3 0%, #79BFFF 100%);',
        'texture': `linear-gradient(
          134deg,
          rgba(1, 1, 1, 0.02) 0%,
          rgba(1, 1, 1, 0.02) 16%,
          transparent 16%,
          transparent 76%,
          rgba(58, 58, 58, 0.02) 76%,
          rgba(58, 58, 58, 0.02) 100%
        ),
        linear-gradient(
          215deg,
          rgba(166, 166, 166, 0.02) 0%,
          rgba(166, 166, 166, 0.02) 33%,
          transparent 33%,
          transparent 79%,
          rgba(111, 111, 111, 0.02) 79%,
          rgba(111, 111, 111, 0.02) 100%
        ),
        linear-gradient(
          303deg,
          rgba(215, 215, 215, 0.02) 0%,
          rgba(215, 215, 215, 0.02) 7%,
          transparent 7%,
          transparent 90%,
          rgba(192, 192, 192, 0.02) 90%,
          rgba(192, 192, 192, 0.02) 100%
        ),
        linear-gradient(
          302deg,
          rgba(113, 113, 113, 0.02) 0%,
          rgba(113, 113, 113, 0.02) 34%,
          transparent 34%,
          transparent 73%,
          rgba(65, 65, 65, 0.02) 73%,
          rgba(65, 65, 65, 0.02) 100%
        ),
        linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 255, 255))`
      },
      boxShadow: {
        'colored-lg': '0px 4px 4px rgba(0, 0, 0, 0.04), 0px 12px 20px rgba(47, 103, 98, 0.16)',
        'colored-lg-up': '0px -4px 4px rgba(0, 0, 0, 0.04), 0px -12px 20px rgba(47, 103, 98, 0.12)',
        'footer': '0px -4px 4px rgba(0, 0, 0, 0.04), 0px -12px 20px rgba(47, 103, 98, 0.12)',
        'icon': '0px 2px 4px rgba(0, 0, 0, 0.1)',
        'button': '0px 2px 6px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        xlg: '0.75rem',
      },
      lineHeight: {
        base: '1.6',
      },
      letterSpacing: {
        base: '0.5px',
      },
      opacity: {
        20: '.20',
        40: '.40',
        85: '.85',
      },
      backgroundOpacity: {
        10: '.10',
      },
      inset: {
        '100': '100%',
        '1/2': '50%',
      },
    },
  },
  variants: {
    display: ['responsive', 'group-hover'],
    backgroundColor: ['responsive', 'hover', 'focus'],
    borderWidth: ['responsive', 'hover', 'focus', 'first'],
    borderColor: ['responsive', 'hover', 'focus'],
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    margin: ['responsive', 'first'],
    padding: ['responsive', 'first'],
  },
  plugins: [
    plugin(function({ addBase, config }) {
      addBase({
        '.container': {
          'width': '100%',
          'maxWidth': config('theme.screens.xl'),
          'padding-left': config('theme.spacing.4'),
          'padding-right': config('theme.spacing.4'),
          'margin-left': 'auto',
          'margin-right': 'auto',
          '@screen lg': {
            'padding-left': config('theme.spacing.12'),
            'padding-right': config('theme.spacing.12'),
          },
        },
        'body': {
          fontFamily: config('theme.fontFamily.sans').join(', '),
          lineHeight: config('theme.lineHeight.base'),
          letterSpacing: config('theme.letterSpacing.base'),
          color: config('theme.colors.neutral-800'),
          // config('theme.fontSmoothing.antialiased')
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        '.drop-shadow-icon': {
          'filter': 'drop-shadow(0 2px 5px rgba(0, 0, 0, .4))',
        },
      })
    })
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
}
