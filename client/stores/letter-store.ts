import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"

type ILetterData = {
  id: string
  title: string
  sections: string[]
}
type ILetterState = {
  current: string | undefined
  letterVos: { [key: string]: ILetterData }
  letters: string[]
}
type ILetterActions = {
  createLetter: (data: { title: string }) => ILetterData

  setLetter: (id: string, data: ILetterData) => void

  getLetter: (id: string) => ILetterData | null

  updateLetter: (id: string, data: any) => void
}

export const useLetterStore = create<ILetterState & ILetterActions>()(
  (set, get) => {
    return {
      current: undefined,
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

      setLetter(id, data) {
        return set((state) => ({
          ...state.letterVos,
          [id]: data,
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
            return {
              ...letterVos,
              [id]: {
                ...item,
                ...data,
              },
            }
          }
          return {}
        })
      },
    }
  }
)
