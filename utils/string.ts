function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

function pascalCase(str: string): string {
  return camelCase(str).replace(/^[a-z]/, (g) => g[0].toUpperCase())
}

function kebabCase(str: string): string {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
}

function snakeCase(str: string): string {
  return kebabCase(str).replace(/-/g, '_')
}

function constantCase(str: string): string {
  return snakeCase(str).toUpperCase()
}

function dotCase(str: string): string {
  return kebabCase(str).replace(/-/g, '.')
}

function pathCase(str: string): string {
  return kebabCase(str).replace(/-/g, '/')
}

function sentenceCase(str: string): string {
  return str.replace(/([A-Z])/g, (g) => ` ${g[0].toLowerCase()}`)
}

function titleCase(str: string): string {
  return sentenceCase(str).replace(/^[a-z]/, (g) => g[0].toUpperCase())
}

export {
  slugify,
  camelCase,
  pascalCase,
  kebabCase,
  snakeCase,
  constantCase,
  dotCase,
  pathCase,
  sentenceCase,
  titleCase
}
