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

  useEffect(() => {
    const fontItem4 = {
      id: "0004",
      name: "AB",
    }
    const fontItem = {
      id: "0003",
      name: "JYY",
    }
    const fontItem2 = {
      id: "0002",
      name: "Font002",
    }
    // setFont(fontItem.id)

    // font.load().then(function () {
    //   console.log("Font002 has loaded.")
    //   setFont(fontItem.id)
    // })
  }, [])

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
