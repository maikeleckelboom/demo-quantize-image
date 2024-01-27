/**
 * This function is a recursive implementation of the find function.
 * It takes an array of objects and a callback function to find the first item that satisfies the condition.
 * If the item has a children property, the function is called recursively on the children.
 * The function returns the first item that satisfies the condition, or undefined if none is found.
 *
 * @param oldArray
 * @param callback
 */
export const findRecursive = <T extends Record<string, unknown>>(
  oldArray: Array<T & { children?: T[] }>,
  callback: (item: T) => boolean
): T | undefined => {
  // Iterate through the array to find the first item that satisfies the condition
  for (const item of oldArray) {
    // Check if the current item satisfies the condition
    if (callback(item)) {
      return item
    }
    // If the current item has children, apply recursion
    if (item.children) {
      const foundInChildren = findRecursive<T>(item.children, callback)
      // If an item is found in the children, return it
      if (foundInChildren) {
        return foundInChildren
      }
    }
  }

  // Return undefined if no item satisfies the condition
  return undefined
}
