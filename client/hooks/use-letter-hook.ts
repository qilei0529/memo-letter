import { useEffect, useMemo } from "react"
import { useLetterStore } from "../stores/letter-store"
import { useInputerStore } from "../stores/input-store"
import { RIGHT } from "./use-inputer-hook"
import { useSelectStore } from "../stores/select-store"

/**
 * letter
 * @param param0
 * @returns
 */
export const useLetterHook = ({ id }: { id: string }) => {
  const current = useLetterStore((state) => state.current)
  const letterVos = useLetterStore((state) => state.letterVos)
  const getLetter = useLetterStore((state) => state.getLetter)
  const createLetter = useLetterStore((state) => state.createLetter)
  const setLetter = useLetterStore((state) => state.setLetter)
  const setCurrent = useLetterStore((state) => state.setCurrent)

  const insertSectionAt = useLetterStore((state) => state.insertSectionAt)
  const removeSectionAt = useLetterStore((state) => state.removeSectionAt)

  const updateSelector = useSelectStore((state) => state.updateSelector)

  const letter = useMemo(() => {
    return getLetter(current ?? "")
  }, [current, letterVos])

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

  const insert = (
    section: string,
    newLine?: boolean,
    next?: (section: number) => void
  ) => {
    const { current, letterVos } = useLetterStore.getState()
    const { selectorVos } = useSelectStore.getState()
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
      next?.(at)
    }
  }

  const remove = () => {
    const { current } = useLetterStore.getState()
    const { selectorVos } = useSelectStore.getState()
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
          updateSelector(current, {
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

export type BoxItem = {
  section: number
  start: number
  end: number
}

export type PageItem = {
  boxs: BoxItem[]
  list: string[]
  vos: { [key: string]: BlockItem }
  start: number
}

export type BlockItem = {
  section: number
  pos: { x: number; y: number }
  text: string
  size: number
}

export function transLetterToPos(letter: string) {
  // 信 页面列表
  const pages: PageItem[] = []

  let sections = letter.split("\n")

  let pointX = 0
  let pointY = 0

  let page: PageItem = {
    boxs: [],
    list: [],
    vos: {},
    start: 0,
  }

  const createPage = (section: number) => {
    page = {
      boxs: [],
      list: [],
      vos: {},
      start: section,
    }
    pointY = 0
    pages.push(page)
  }

  createPage(0)

  // page size
  const pageSize = 23 // is +1
  // each
  sections.forEach((line, index) => {
    // 每一行 都增加一个 box
    let box: BoxItem = {
      start: pointY,
      end: pointY,
      section: index,
    }
    page.boxs.push(box)

    // 处理 单行字
    let sectionText = line

    // 对齐
    let align = Align.left
    // 处理 右对齐
    if (line.startsWith(RIGHT)) {
      sectionText = line.replace(RIGHT, "")
      align = Align.right
    }
    // 循环 每个字
    if (sectionText.length) {
      // 缓存 字 列表
      let tempList: any[] = []
      // 指针
      pointX = 0

      for (let i = 0; i < sectionText.length; i++) {
        const text = sectionText[i]
        // 如果是中文标点 在最后的时候不处理，防止标点在下一行的第一位。
        if (isChinesePunctuation(text)) {
          // do not create new line
        } else if (pointX > 40) {
          // 新建 新行
          pointX = 0
          pointY += 1

          if (pointY > pageSize) {
            // create a new page
            createPage(index + 1)
          }

          // update box.end
          box.end = pointY
          insertLine(tempList, page)
          tempList = []
        }
        const d = getWidth(text)
        const item: BlockItem = {
          pos: { x: pointX, y: pointY },
          text: text,
          section: index,
          size: d,
        }
        tempList.push(item)
        pointX += d
      }
      // reduce right
      if (align === Align.right) {
        const len = tempList.length
        let x = 42
        for (let i = len - 1; i >= 0; i--) {
          const item = tempList[i]
          const { pos, size } = item
          x = x - size
          const newPos = { x: x, y: pos.y }
          item.pos = newPos
        }
      }
      insertLine(tempList, page)
    }
    // 处理 一行后 增加 y 的值
    pointY += 1

    if (pointY > pageSize) {
      createPage(index + 1)
    }
  })

  // 最后再加一行用于新增
  if (sections.length) {
    page.boxs.push({
      start: pointY,
      end: pointY,
      section: sections.length,
    })
  }

  return {
    pages,
  }
}

// 插入 数据 到 vos 和 list
const insertLine = (data: any[], target: any) => {
  data.forEach((item) => {
    const { pos } = item
    const key = `${pos.y}_${pos.x}`
    target.vos[key] = item
    target.list.push(key)
  })
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

export function isChinese(char: string) {
  return /^[\u4e00-\u9fa5]$/.test(char)
}

export function isChinesePunctuation(char: string) {
  return /[\u3001\u3002\uFF0C\uFF1F\uFF01]/.test(char)
}

export function isNormalText(char: string) {
  const regex = /^[a-zA-Z0-9]*$/
  return regex.test(char)
}
