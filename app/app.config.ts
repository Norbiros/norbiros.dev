export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `© ${new Date().getFullYear()} Norbiros`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/Norbiros',
      'target': '_blank',
      'aria-label': 'Norbiros on GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/norbert-szeremet/',
      'target': '_blank',
      'aria-label': 'Norbiros on LinkedIn'
    }, {
      'icon': 'i-simple-icons-x',
      'to': 'https://x.com/norbiros_dev',
      'target': '_blank',
      'aria-label': 'Norbiros on X'
    }]
  }
})
