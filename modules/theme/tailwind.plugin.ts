import plugin from 'tailwindcss/plugin'

function tailwindMaterialColorTheme() {
  return plugin(({ addBase, theme }) => {
    addBase({
      html: {
        '@apply bg-background font-roboto text-body-md text-on-background': {}
      }
    })
  })
}

function tailwindCustomVariants() {
  return plugin(({ addVariant: add }) => {
    add('link-active', '&.router-link-active')
    add('link-exact-active', '&.router-link-exact-active')
    add('all', '& *')
    add('button', '& button')
    add('icon', '& .icon')
    add('label-text', '& .label-text')
    add('current', '& .current')
  })
}

export { tailwindMaterialColorTheme, tailwindCustomVariants }
