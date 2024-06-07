import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'serif'],
      },
      colors: {
        gray: {
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        indigo: {
          600: '#4F46E5',
        },
      },
      screens: {
        mobile: "425px",
      },
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "#52307c",
          secondary: "rgb(24, 24, 24)",
        },
      },	
    ],
  },
};

//
