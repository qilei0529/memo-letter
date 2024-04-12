import { create } from "zustand"
import { persist } from "zustand/middleware"

export type FontData = {
  id: string
  name: string
  path: string

  status: "WAIT" | "READY" | string
  total?: number
}

type FontState = {
  current: string

  fontVos: { [key: string]: FontData }
  fontList: string[]

  updateFont: (key: string, data: any) => void
  insertFont: (font: FontData, at: number) => void

  setCurrent: (key: string) => void
}

export const defaultFont: { [key: string]: FontData } = {
  system: {
    id: "system",
    name: "system",
    path: "/font.ttf",
    status: "WAIT",
    total: 7427360,
  },
}

export const defaultFontList = ["system"]

export const useFontStore = create<FontState>()(
  persist(
    (set, get) => {
      return {
        fontVos: defaultFont,
        fontList: defaultFontList,
        current: "system",
        setCurrent: (current) => set((state) => ({ current })),
        updateFont(key, data) {
          const { fontVos } = get()
          const vos = { ...fontVos }
          const item = vos[key]
          if (item) {
            set({
              fontVos: {
                ...vos,
                [key]: {
                  ...item,
                  ...data,
                },
              },
            })
          }
        },

        insertFont(font, at) {
          const { fontVos, fontList } = get()
          const vos = { ...fontVos }
          const list = fontList.splice(at ?? 99, 0, font.id)
          console.log("insert", font, list)
          set({
            fontVos: {
              ...vos,
              [font.id]: font,
            },
            fontList: list,
          })
        },
      }
    },
    {
      version: 1,
      name: "__DB__FONT",
    }
  )
)
