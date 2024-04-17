import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blinkingBg: {
          "0%, 100%": { opacity: "1" },
          "40%, 60%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blinkingBg 1s infinite",
      },
    },
  },
  plugins: [],
}
export default config
