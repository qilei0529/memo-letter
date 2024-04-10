import { useEffect, useMemo } from "react"
import { useLetterStore } from "../stores/letter-store"
import { useInputerStore } from "../stores/input-store"

export const useLetterHook = ({ id }: { id: string }) => {
  const current = useLetterStore((state) => state.current)
  const letterVos = useLetterStore((state) => state.letterVos)
  const getLetter = useLetterStore((state) => state.getLetter)
  const createLetter = useLetterStore((state) => state.createLetter)
  const setLetter = useLetterStore((state) => state.setLetter)
  const setCurrent = useLetterStore((state) => state.setCurrent)

  const insertSectionAt = useLetterStore((state) => state.insertSectionAt)
  const removeSectionAt = useLetterStore((state) => state.removeSectionAt)

  const selectorVos = useInputerStore((state) => state.selectorVos)
  const setSelector = useInputerStore((state) => state.setSelector)

  const letter = useMemo(() => {
    return getLetter(current ?? "")
  }, [current, letterVos])

  const selector = useMemo(() => {
    return {
      value: selectorVos[current ?? ""],
      update: (index: number) => {
        if (current) {
          let n = index
          const letter = getLetter(current ?? "")
          if (letter) {
            const { sections } = letter
            if (n > -1) {
              if (n > sections.length) {
                n = sections.length
              }
              setSelector(current, {
                section: n,
              })
            } else {
              // clear selector
              setSelector(current, null)
            }
          }
        }
      },
    }
  }, [current, selectorVos])

  useEffect(() => {
    setTimeout(() => {
      const { current } = useLetterStore.getState()
      if (!current) {
        const letter = createLetter({ title: "text" })
        setLetter(letter.id, letter)
        setCurrent(letter.id)
        console.log("create", letter)
      }
    }, 100)
  }, [id])

  const insert = (section: string, newLine?: boolean, isUpdate?: boolean) => {
    const { current, letterVos } = useLetterStore.getState()
    const { selectorVos } = useInputerStore.getState()
    if (current) {
      const letter = letterVos[current]
      const selector = selectorVos[current]
      let at = selector?.section ?? letter?.sections.length
      let isNeedUpdate = selector?.section !== undefined
      if (newLine) {
        isNeedUpdate = false
        at += 1
        insertSectionAt(current, "", at)
      } else {
        const lines =
          section.indexOf("\n") > -1 ? section.split("\n") : [section]
        lines.forEach((line, index) => {
          insertSectionAt(current, line, at, index === 0 ? isNeedUpdate : false)
          at += 1
        })
      }

      // 切换到新的一行
      if (!isUpdate) {
        setSelector(current, {
          section: at,
        })
      }
    }
  }

  const remove = () => {
    const { current } = useLetterStore.getState()
    const { selectorVos } = useInputerStore.getState()
    if (current) {
      const selector = selectorVos[current]
      if (selector) {
        const section = selector.section
        if (section >= 0) {
          removeSectionAt(current, section)
          // 更新 section 到上一行
          let newSectionIndex = section - 1
          if (newSectionIndex < 0) {
            newSectionIndex = 0
          }
          setSelector(current, {
            section: newSectionIndex,
          })
        }
      }
    }
  }

  return {
    letter,
    insert,
    remove,
    selector,
  }
}

/**
 *
 * @param letter
 * @returns
 */

export enum Align {
  left = "LEFT",
  right = "RIGHT",
}

export function transLetterToPos(letter: string) {
  const vos: any = {}
  const list: string[] = []
  let sections = letter.split("\n")
  let x = 0
  let y = 0
  const pvos: {
    start: number
    end: number
  }[] = []

  sections.forEach((line, n) => {
    // 每一行 都增加一个 pvos
    let pItem = {
      start: y,
      end: y,
    }
    pvos.push(pItem)

    let section = line
    let align = Align.left
    let RIGHT = "→  "
    if (line.startsWith(RIGHT)) {
      section = line.replace(RIGHT, "")
      align = Align.right
    }
    if (section.length) {
      x = 0
      let lineData: any[] = []

      const insertLine = (data: any[]) => {
        data.forEach((item) => {
          const { pos } = item
          const key = `${pos.y}_${pos.x}`
          vos[key] = item
          list.push(key)
        })
      }

      for (let i = 0; i < section.length; i++) {
        const text = section[i]
        if (isChinesePunctuation(text)) {
        } else if (x > 40) {
          x = 0
          y += 1
          pItem.end = y
          insertLine(lineData)
          lineData = []
        }
        // 如果第一位是标点，就放到前一行的最后
        const pos = { x: x, y: y }
        const d = getWidth(text)
        const item = {
          pos: pos,
          text: text,
          section: n,
          width: d,
        }
        lineData.push(item)
        x += d
      }
      // reduce right
      if (align === Align.right) {
        const len = lineData.length
        let x = 42
        for (let i = len - 1; i >= 0; i--) {
          const item = lineData[i]
          const { pos, width } = item
          x = x - width
          const newPos = { x: x, y: pos.y }
          item.pos = newPos
        }
      }
      insertLine(lineData)
    }
    y += 1
  })

  // 最后再加一行用于新增
  if (sections.length) {
    pvos.push({
      start: y,
      end: y,
    })
  }

  return {
    vos,
    list,
    pvos,
    lines: y,
  }
}

function getWidth(char: string) {
  if (isChinese(char)) {
    return 2
  }
  if (isChinesePunctuation(char)) {
    return 2
  }
  return 1
}

function isChinese(char: string) {
  return /^[\u4e00-\u9fa5]$/.test(char)
}

function isChinesePunctuation(char: string) {
  return /[\u3001\u3002\uFF0C\uFF1F\uFF01]/.test(char)
}
