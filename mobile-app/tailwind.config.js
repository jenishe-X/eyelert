/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./index.js", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        royal: "#5E0006",
        "royal-pressed": "#450004",
        "royal-foreground": "#F5D0D3",
        canvas: "#F6F3EB",
        accent: "#2F2FE4",
        safety: "#DC2626",
        ink: "#000000",
        body: "#1A1A1A",
        surface: "#FFFFFF",
        divider: "#E5E7EB",
        muted: "#6B7280",
        night: {
          bg: "#141110",
          surface: "#1F1C1A",
          border: "#3D3835",
          body: "#E5DFD6",
          muted: "#9A928A",
          heading: "#F6F3EB",
        },
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        "sans-medium": ["Inter_600SemiBold"],
        "sans-semibold": ["Inter_600SemiBold"],
        "sans-bold": ["Inter_700Bold"],
        display: ["Montserrat_800ExtraBold"],
        "display-semibold": ["Montserrat_700Bold"],
      },
    },
  },
  plugins: [],
};
