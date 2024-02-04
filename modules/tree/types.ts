interface MenuItem {
  label: string
  name?: string

  leadingIcon?: string
  trailingIcon?: string
  trailingText?: string
  shortcuts?: string[]

  onClick?: () => void

  children?: MenuItem[]

  selectable?: boolean
  multiple?: boolean
  minSelections?: number

  selected?: boolean
  open?: boolean
  disabled?: boolean
}

function hasChildren(item: MenuItem): item is MenuItem & { children: MenuItem[] } {
  return item.children !== undefined
}

function isSelectable(item: MenuItem): item is MenuItem & { selectable: true } {
  return item.selectable === true
}

type ExcludeKeys =
  | 'checkbox'
  | 'trailing-icon'
  | 'trailing-text'
  | 'leading-icon'
  | 'shortcuts'
  | 'toggle-icon'

export type { MenuItem, ExcludeKeys }
export { hasChildren, isSelectable }

type TreeItem = {
  label: string
  leadingIcon?: string
}

type TreeFolder = TreeItem & {
  open?: boolean
  children: TreeItem[]
}

type TreeSelectItem = TreeItem & {
  selected?: boolean
}

type TreeSelectFolder = TreeFolder & {
  selectable?: boolean
  multiple?: boolean
  minSelections?: number
  children: TreeSelectItem[]
}

type TreeNode = TreeItem | TreeFolder

function isTreeFolder(item: TreeNode): item is TreeFolder {
  return 'children' in item && Array.isArray(item.children)
}

function isTreeSelectFolder(item: TreeNode): item is TreeSelectFolder {
  return isTreeFolder(item) && 'selectable' in item
}

function isTreeSelectItem(item: TreeNode): item is TreeSelectItem {
  return !isTreeSelectFolder(item) && 'selected' in item
}

export { isTreeFolder, isTreeSelectFolder, isTreeSelectItem }
export type { TreeItem, TreeFolder, TreeNode }
