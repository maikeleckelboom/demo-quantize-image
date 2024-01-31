import type { JSONDataType } from 'vue-json-pretty/types/utils'
import type { NodeDataType } from 'vue-json-pretty/types/components/TreeNode'

interface JsonPrettyProps {
  data: JSONDataType
  showLength: boolean
  showDoubleQuotes: boolean
  showSelectController: boolean
  showLine: boolean
  showLineNumber: boolean
  selectOnClickNode: boolean
  nodeSelectable: (node: NodeDataType) => boolean
  highlightSelectedNode: boolean
  showIcon: boolean
  showKeyValueSpace: boolean
  editable: boolean
  editableTrigger: 'click' | 'dblclick'
  collapsedNodeLength: number
  deep: number
  pathCollapsible: (node: NodeDataType) => boolean
  rootPath: string
  virtual: boolean
  height: number
  itemHeight: number
  selectedValue: string | string[]
  collapsedOnClickBrackets: boolean
}

export type { JsonPrettyProps, JSONDataType, NodeDataType }
