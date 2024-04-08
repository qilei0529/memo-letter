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
            if (n >= 0) {
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

  const insert = (section: string, newLine?: boolean) => {
    const { current, letterVos } = useLetterStore.getState()
    const { selectorVos } = useInputerStore.getState()
    if (current) {
      const letter = letterVos[current]
      const selector = selectorVos[current]
      console.log("insert", section, selector.section, newLine)
      let at = selector?.section ?? letter?.sections.length
      let isUpdate = selector?.section !== undefined
      if (newLine) {
        isUpdate = false
        at += 1
        insertSectionAt(current, "", at)
      } else {
        const lines =
          section.indexOf("\n") > -1 ? section.split("\n") : [section]

        lines.forEach((line, index) => {
          insertSectionAt(current, line, at, index === 0 ? isUpdate : false)
          at += 1
        })
      }

      // 如果 是修改 当前不是最后一行？

      // 切换到新的一行
      setSelector(current, {
        section: at,
      })
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
  sections.forEach((section, n) => {
    // 每一行 都增加一个 pvos
    let pItem = {
      start: y,
      end: y,
    }
    pvos.push(pItem)
    if (section.length) {
      if (section.startsWith("→  ")) {
        let len = section.length
        if (len) {
          x = 42
          // 靠右显示
          let sublist = []
          for (let i = len - 1; i >= 3; i--) {
            const text = section[i]
            x -= getWidth(text)
            if (x > 41) {
              // 这里 如果很长的话有点意思
              // 会有 bug
              // x = 0
              // y += 1
            }

            const pos = { x: x, y: y }
            const key = `${y}_${x}`
            sublist.unshift(key)
            const item = {
              pos: pos,
              text: text,
              section: n,
            }
            vos[key] = item
          }
          sublist.forEach((item) => {
            list.push(item)
          })
        }
      } else {
        x = 0
        for (let i = 0; i < section.length; i++) {
          const text = section[i]
          if (isChinesePunctuation(text)) {
          } else if (x > 40) {
            x = 0
            y += 1
            pItem.end = y
          }
          // 如果第一位是标点，就放到前一行的最后

          const pos = { x: x, y: y }
          const key = `${y}_${x}`
          list.push(key)
          const item = {
            pos: pos,
            text: text,
            section: n,
          }
          vos[key] = item
          x += getWidth(text)
        }
      }
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
