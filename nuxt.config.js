export default {
    css: ["@/assets/css/main.css"], // Include Tailwind CSS
    buildModules: ["@nuxt/postcss8"], // Nuxt 2 uses `buildModules`
    modules: [
      '@nuxt/content',
      '@nuxt/image',
    ],
    build: {
      postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
    ssr: false, // Disable Server-Side Rendering (SPA Mode)
    target: 'static', // For static site generation
    plugins: ["~/plugins/firebase.js"], // Use `.js` for Nuxt 2 plugins
  };
  