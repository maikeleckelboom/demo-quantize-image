/**
 * This function is a recursive implementation of the filter function.
 * It takes an array of objects and a callback function to apply as the filter condition.
 * The callback function is applied on each item, and if the condition is met, the item is included in the new array.
 * If the item has a children property, the function is called recursively on the children.
 * The function returns the new filtered array.
 *
 * @param oldArray
 * @param condition
 * @param newArray
 */
export const filterRecursive = <T extends Record<string, unknown>>(
  oldArray: Array<T & { children?: T[] }>,
  condition: (item: T) => boolean,
  newArray: T[] = []
): T[] => {
  // base case: check if there are any items left in the original array to process
  if (oldArray.length <= 0) {
    // if all items have been processed, return the new array
    return newArray
  } else {
    // destructure the first item from the old array and put the remaining in a separate array
    let [item, ...theRest] = oldArray

    // checks if the item has children to apply recursion
    if (item.children) {
      // the item with children is cloned to avoid mutating the original array when applying recursion
      item = { ...item, children: filterRecursive<T>(item.children, condition) }
    }

    // include the item in the new array if it satisfies the condition
    if (condition(item)) {
      newArray.push(item)
    }

    // return a recursive call to filter to process the next item
    return filterRecursive<T>(theRest, condition, newArray)
  }
}
