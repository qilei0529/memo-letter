import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"

type ILetterData = {
  id: string
  title: string
  sections: string[]
}

type ISelectorData = {
  section: number
}

type ILetterState = {
  current: string | undefined
  letterVos: { [key: string]: ILetterData }

  letters: string[]
}

type ILetterActions = {
  createLetter: (data: { title: string }) => ILetterData

  setLetter: (id: string, data: ILetterData) => void

  setCurrent: (id: string) => void

  getLetter: (id: string) => ILetterData | null

  updateLetter: (id: string, data: any) => void

  insertSectionAt: (
    id: string,
    section: string,
    at: number,
    update?: boolean
  ) => void
  removeSectionAt: (id: string, at: number) => void
}

export const useLetterStore = create<ILetterState & ILetterActions>()(
  persist(
    (set, get) => {
      return {
        current: undefined,
        selectorVos: {},
        letterVos: {},
        letters: [],

        createLetter({ title }) {
          const item: ILetterData = {
            id: uuidv4(),
            title: title,
            sections: [],
          }
          return item
        },

        setCurrent(id) {
          return set((state) => {
            const { getLetter } = state
            if (getLetter(id)) {
              return {
                current: id,
              }
            }
            return {}
          })
        },

        setLetter(id, data) {
          return set((state) => ({
            letterVos: {
              ...state.letterVos,
              [id]: data,
            },
          }))
        },

        getLetter(id) {
          const { letterVos } = get()
          return letterVos[id] ?? null
        },

        updateLetter(id, data) {
          return set((state) => {
            const { getLetter, letterVos } = state
            const item = getLetter(id)
            if (item) {
              const newItem = {
                ...item,
                ...data,
              }
              return {
                letterVos: {
                  ...letterVos,
                  [id]: newItem,
                },
              }
            }
            return {}
          })
        },

        insertSectionAt(id, section, at, update) {
          const { getLetter, updateLetter } = get()
          const item = getLetter(id)
          if (item) {
            const { sections } = item
            const list = [...sections]
            const atIndex = at > sections.length ? sections.length : at
            list.splice(atIndex, update ? 1 : 0, section)
            updateLetter(id, {
              sections: list,
            })
          }
        },

        removeSectionAt(id, at) {
          const { getLetter, updateLetter } = get()
          const item = getLetter(id)
          if (item) {
            const { sections } = item
            const list = [...sections]
            list.splice(at, 1)
            updateLetter(id, {
              sections: list,
            })
          }
        },
      }
    },
    {
      version: 1,
      name: "__DB__LETTER",
    }
  )
)
