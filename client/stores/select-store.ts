import { create } from "zustand"

export type ISelectorData = {
  section: number
  index: number
}

type ISelectState = {
  hoverSection: string
  selectSection: string

  selectorVos: { [key: string]: ISelectorData }

  setSelector: (id: string, selector: ISelectorData | null) => void
  updateSelector: (id: string, data?: { section: number }) => void
  getSelector: (id: string) => ISelectorData | null

  updateHoverSection: (section?: string) => void
}

export const useSelectStore = create<ISelectState>()((set, get) => {
  return {
    hoverSection: "",
    selectSection: "",

    selectorVos: {},

    updateHoverSection(section = "") {
      set({
        hoverSection: section,
      })
    },

    setSelector(id, selector) {
      return set((state) => {
        const vos = { ...state.selectorVos }
        if (selector) {
          vos[id] = selector
        } else {
          delete vos[id]
        }
        return {
          selectorVos: vos,
        }
      })
    },

    updateSelector(id, data) {
      const { getSelector } = get()
      const item = getSelector(id)
      if (item) {
        set((state) => {
          const vos = { ...state.selectorVos }
          if (data) {
            vos[id] = {
              ...item,
              ...data,
            }
          }
          return {
            selectorVos: vos,
          }
        })
      }
    },

    getSelector(id) {
      const { selectorVos } = get()
      return selectorVos[id] ?? null
    },
  }
})
