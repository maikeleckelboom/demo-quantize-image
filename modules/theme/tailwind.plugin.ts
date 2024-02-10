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
  const execute = () =>
    plugin(({ addVariant }) => {
      addVariant('link-active', '&.router-link-active')
      addVariant('link-exact-active', '&.router-link-exact-active')
      addVariant('button', '& button')
      addVariant('icon', '& .icon')
      addVariant('label-text', '& .label-text')
    })
  return execute()
}

export { tailwindMaterialColorTheme, tailwindCustomVariants }
