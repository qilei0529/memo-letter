import { create } from "zustand"
import { persist } from "zustand/middleware"

type ISelectorData = {
  section: number
}

type InputState = {
  selectorVos: { [key: string]: ISelectorData }

  value: string

  active: boolean
  show: boolean

  align: "RIGHT" | "LEFT"

  focusTimeStamp: number
}

type IInputActions = {
  setSelector: (id: string, selector: ISelectorData | null) => void

  setValue: (value: string) => void

  toggleShow: (show: boolean) => void
  toggleActive: (active: boolean) => void

  setAlign: (align: "RIGHT" | "LEFT") => void

  inputFocus: (n?: number) => void
}

export const useInputerStore = create<InputState & IInputActions>()(
  // persist(
  (set, get) => {
    return {
      show: false,

      selectorVos: {},

      value: "",

      active: false,

      align: "LEFT",

      focusTimeStamp: 0,

      setValue: (value) =>
        set((state) => {
          // const RIGHT = "→  "
          // if (value.startsWith(RIGHT)) {
          //   return { value: value.replace(RIGHT, ""), alignRight: true }
          // }
          return { value }
        }),

      setAlign: (align) => set((state) => ({ align })),

      toggleShow: (show) => set((state) => ({ show })),
      toggleActive: (active) => set((state) => ({ active })),

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

      inputFocus(n) {
        set({
          focusTimeStamp: n ?? new Date().getTime(),
        })
      },
    }
  }
  // {
  //   version: 1,
  //   name: "__DB__INPUTER",
  // }
  // )
)
