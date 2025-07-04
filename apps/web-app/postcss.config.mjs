const config = {
  plugins: [
    [
      "@tailwindcss/postcss",
      {
        content: ['./src/**/*.{js,jsx,ts,tsx}'],
        theme: {
          extend: {
            animation: {
              dot1: 'dot1 2s infinite',
              dot2: 'dot2 2s infinite',
              dot3: 'dot3 1s alternate infinite',
            },
            keyframes: {
              dot1: {
                '0%': { opacity: '0.2', transform: 'translate(-50%, -50%)' },
                '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(5)' },
              },
              dot2: {
                '0%': { opacity: '1', transform: 'translate(-50%, -50%)' },
                '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(2)' },
              },
              dot3: {
                '0%': { transform: 'translate(-50%, -50%)' },
                '100%': { transform: 'translate(-50%, -50%) scale(1.1)' },
              },
            },
          },
        },
        plugins: [],
      },
    ],
    "autoprefixer",
  ],
};

export default config;