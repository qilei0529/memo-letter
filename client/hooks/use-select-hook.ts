import { useMemo } from "react"
import { useSelectStore } from "../stores/select-store"
import { useLetterStore } from "../stores/letter-store"
import { useInputerStore } from "../stores/input-store"
import { Align } from "./use-letter-hook"
import { RIGHT } from "./use-inputer-hook"

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
  const setInputAlign = useInputerStore((state) => state.setAlign)
  const setInputValue = useInputerStore((state) => state.setValue)

  const updateInputValue = (section: number) => {
    const letter = getLetter(current ?? "")
    if (letter) {
      const { sections } = letter
      let text = sections[section] ?? ""
      let align = text.startsWith(RIGHT)

      setInputAlign(align ? Align.right : Align.left)
      setInputValue(text.replace(RIGHT, ""))
    }
  }

  const selector = useMemo(() => {
    return {
      value: selectorVos[current ?? ""],
      get: (id?: string) => getSelector(id ?? current ?? ""),
      update: (section: number, index?: number) => {
        if (current) {
          console.log("select", section)
          const letter = getLetter(current ?? "")
          if (letter) {
            const { sections } = letter
            if (section > -1) {
              if (sections.length && section >= sections.length) {
                section = sections.length - 1
              }
              const text = sections[section] ?? ""
              setSelector(current, {
                section: section,
                index: index !== undefined ? index : text.length,
              })
            } else {
              // clear selector
              setSelector(current, null)
              inputFocus(0)
            }
          }
        }
      },
      showInput: () => {
        toggleShow(true)
        setTimeout(() => {
          inputFocus()
        }, 100)
      },
      hideInput: () => {
        toggleShow(false)
        setTimeout(() => {
          inputFocus(0)
        }, 100)
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
    updateInputValue,
  }
}
