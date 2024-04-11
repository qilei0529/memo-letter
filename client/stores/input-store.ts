import { create } from "zustand"

type InputState = {
  value: string

  active: boolean
  show: boolean

  align: "RIGHT" | "LEFT"

  focusTimeStamp: number
}

type IInputActions = {
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

      value: "",

      active: false,

      align: "LEFT",

      focusTimeStamp: 0,

      setValue: (value) => set((state) => ({ value })),

      setAlign: (align) => set((state) => ({ align })),

      toggleShow: (show) => set((state) => ({ show })),
      toggleActive: (active) => set((state) => ({ active })),

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
