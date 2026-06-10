// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://norbiros.dev',
    name: 'Norbiros',
    description: 'Open-source developer — Nuxt, Rust, and Minecraft mods.',
    defaultLocale: 'en'
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: false,

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Norbert Szeremet',
      alternateName: 'Norbiros',
      url: 'https://norbiros.dev',
      sameAs: [
        'https://github.com/Norbiros',
        'https://x.com/norbiros_dev',
        'https://discordapp.com/users/770620808644919307'
      ]
    }
  }
})
