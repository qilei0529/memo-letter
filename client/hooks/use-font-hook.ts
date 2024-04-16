import { useEffect, useMemo, useState } from "react"

import { useFontStore, defaultFont } from "../stores/font-store"

export const useFontHook = () => {
  const font = useFontStore((state) => state.current)
  const fontList = useFontStore((state) => state.fontList)
  const fontVos = useFontStore((state) => state.fontVos)
  const insertFont = useFontStore((state) => state.insertFont)
  const updateFont = useFontStore((state) => state.updateFont)

  const initFont = () => {
    Object.keys(defaultFont).forEach((key: string) => {
      const font = defaultFont[key]
      insertFont(font, 99)
    })
  }

  const list = useMemo(() => {
    return fontList.map((key: string) => {
      return fontVos[key]
    })
  }, [fontList])

  return {
    font,
    fontVos,
    list,
    initFont,
    updateFont,
  }
}
