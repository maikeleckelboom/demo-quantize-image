/**
 * This function is a recursive implementation of the map function.
 * It takes an array of objects and a callback function to apply on each item.
 * The callback function is applied on each item and the result is pushed to a new array.
 * If the item has a children property, the function is called recursively on the children.
 * The function returns the new array.
 *
 * @param oldArray
 * @param callback
 * @param newArray
 */
export const mapRecursive = <T extends Record<string, unknown>>(
  oldArray: Array<T & { children?: T[] }>,
  callback: (item: T) => T,
  newArray: T[] = []
): T[] => {
  // base case: check if there are any items left in the original array to process
  if (oldArray.length <= 0) {
    // if all items have been processed return the new array
    return newArray
  } else {
    // destructure the first item from old array and put remaining in a separate array
    let [item, ...theRest] = oldArray
    // checks if the item has a children to apply on it the recursion
    if (item.children) {
      //the item with children is cloned to avoid mutating the original array when applying the recursion
      item = { ...item, children: mapRecursive<T>(item.children, callback) }
    }
    // create an array of the current new array and the result of the current item and the callback function
    const interimArray = [...newArray, callback(item)]
    // return a recursive call to map to process the next item.
    return mapRecursive<T>(theRest, callback, interimArray)
  }
}
