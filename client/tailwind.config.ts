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
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      colors: {
        brandYellow: '#FFCD1E',
        secondaryYellow: '#A47F00',
        brandGray: '#858585',
        secondaryGray: '#323232',
        default: "#040117",
        field: "#22222C",
        brandWidget: "#2B2A37",
        secondaryWidget: "#535269",
        brandRed: "#DD3F3F",
        secondaryRed: "#671D1D"
      }
    }
  },
  plugins: []
} satisfies Config
