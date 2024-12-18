const plugin = require('tailwindcss/plugin')
import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ['var(--font-sans)', ...fontFamily.sans]
      // },
      colors: {
        brandYellow: '#E1887F',
        secondaryYellow: '#A47F00',
        brandGray: '#858585',
        secondaryGray: '#323232',
        field: "#22222C",
        brandWidget: "#FFC5C5",
        secondaryWidget: "#535269",
        brandRed: "#DD3F3F",
        secondaryRed: "#671D1D"
      },
      backgroundImage: {
        'default': 'linear-gradient(180deg, #FFE1E1 0%, #FFBDBD 100%)'
      }
    }
  },
  plugins: []
} satisfies Config
