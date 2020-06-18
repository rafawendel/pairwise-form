function getRndArrItem(arr = []) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 
 * @param {number} from 
 * @param {number} to 
 * @param {number[]} except 
 * @returns {number} A random number between 'from' and 'to', apart from 'except'
 */
export function genRndIntBetween(from = 0, to = 0, except = []) {
  if (typeof from !== 'number' || isNaN(from)) return 0
  if (typeof to !== 'number' || isNaN(to)) to = 0
  if (from > to) return 0
  if (!Array.isArray(except)) except = []
  
  const range = [...Array(to - from + 1).keys()].map(i => i + from)
  const filteredRange = range.filter(i => !except.includes(i))
  if (filteredRange.length === 0) return getRndArrItem(range)

  return getRndArrItem(filteredRange)
}

/** 
 * @param {number[]} from
 * @param {number[]} except 
 * @returns {number} A random number among 'from', apart from 'except'
 */
export function genRndIntAmong(from = 0, except = []) {
  if (!Array.isArray(from)) return 0
  if (!Array.isArray(except)) except = []

  const filteredRange = from.filter(i => !except.includes(i))
  if (filteredRange.length === 0) return getRndArrItem(from)

  return getRndArrItem(filteredRange)
}

/**
 * @param {object} seenCountByIndex { id: count }
 * @returns {number[][]} list of lists, in which every index is a count, and the nested lists are the ids within
 */
export function getCountIndices(seenCountByIndex) {
  return Object.entries(seenCountByIndex)
    .reduce((countList, [id, count]) => {
      if (Array.isArray(countList[count])) {
        countList[count].push(+id)
      } else {
        countList[count] = [+id]
      }
      return countList
    }, [])
    .filter(countList => Array.isArray(countList) && countList.length > 0)
}

import React from 'react';
export function useUpdate(callback, deps = []) {
  const isFirstRender = React.useRef(true)

  return React.useEffect(() => {
    if (!isFirstRender.current) {
      const cleanup = callback()
      if (typeof cleanup === 'function') return cleanup
    } else {
      isFirstRender.current = false
    }
  }, deps)
}