import { useMemo } from "react"
import { useSelectStore } from "../stores/select-store"
import { useLetterStore } from "../stores/letter-store"
import { useInputerStore } from "../stores/input-store"

export const useSelectHook = () => {
  // letter
  const current = useLetterStore((state) => state.current)
  const getLetter = useLetterStore((state) => state.getLetter)

  // selector
  const selectorVos = useSelectStore((state) => state.selectorVos)
  const setSelector = useSelectStore((state) => state.setSelector)
  const getSelector = useSelectStore((state) => state.getSelector)

  // input
  const toggleShow = useInputerStore((state) => state.toggleShow)
  const inputFocus = useInputerStore((state) => state.inputFocus)

  const pageSize = 20

  const selector = useMemo(() => {
    return {
      value: selectorVos[current ?? ""],
      get: (id?: string) => getSelector(id ?? current ?? ""),
      update: (index: number) => {
        if (current) {
          console.log("select", index)
          let section = index
          const letter = getLetter(current ?? "")
          if (letter) {
            const { sections } = letter
            if (section > -1) {
              if (section > sections.length) {
                section = sections.length
              }
              setSelector(current, {
                section: section,
              })
            } else {
              // clear selector
              setSelector(current, null)
            }
          }
        }
      },

      showInput: () => {
        toggleShow(true)
        inputFocus()
      },
      hideInput: () => {
        toggleShow(false)
        inputFocus(0)
      },

      moveUp: () => {
        // onDelete(true)
        const selectorData = getSelector(current ?? "")
        const section = selectorData?.section
        if (section !== undefined) {
          selector.update(section - 1)
        }
      },

      moveDown: () => {
        // onDelete(true)
        console.log("down")
        const letter = getLetter(current ?? "")
        if (letter) {
          const selectorData = selector.get()
          const section = selectorData?.section
          if (section !== undefined) {
            selector.update(section + 1)
          } else {
            selector.update(0)
          }
        }
      },
    }
  }, [current, selectorVos])

  return {
    selector,
  }
}
