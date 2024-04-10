import { useEffect, useMemo, useRef } from "react"
import { useInputerStore } from "../stores/input-store"
import { Align } from "./use-letter-hook"

const RIGHT = "→  "

export const useInputerHook = ({ onEnter, onDelete, onChangeValue }: any) => {
  const textareaRef = useRef<any>(null)
  const activeRef = useRef<{ composition?: boolean }>({})

  const value = useInputerStore((state) => state.value)
  const align = useInputerStore((state) => state.align)
  const setAlign = useInputerStore((state) => state.setAlign)
  const focusTimeStamp = useInputerStore((state) => state.focusTimeStamp)
  const setValue = useInputerStore((state) => state.setValue)
  const toggleActive = useInputerStore((state) => state.toggleActive)
  const toggleShow = useInputerStore((state) => state.toggleShow)

  const handleFocus = () => {
    toggleActive(true)
  }

  const handleBlur = () => {
    toggleActive(false)
  }

  const handleEnter = (str: string) => {
    const text = `${align === Align.right ? RIGHT : ""}${str}`
    console.log(align)
    onEnter?.(text)
    // clear
    setValue("")
  }

  const handleChange = (str: string, align: string) => {
    const text = `${align === Align.right ? RIGHT : ""}${str}`
    onChangeValue?.(text)
  }

  const handleKeyDown = (e: any) => {
    let key = ""
    const { value: newValue } = useInputerStore.getState()
    const elm = textareaRef.current
    const cursorPosition = elm.selectionStart
    if (e.key === "Escape") {
      console.log("Escape key pressed")
      key = "ESC"
      toggleActive(false)
      toggleShow(false)
    } else if (e.key === "Tab") {
      key = "TAB"
      const t = e.target.value
      let d = 0
      const TAB = "    "
      const HAlF_TAB = "  "
      const BYTE_TAB = " "
      if (e.shiftKey) {
        if (t.startsWith(TAB)) {
          setValue(`${t.replace(TAB, "")}`)
          d = -4
        } else if (t.startsWith(HAlF_TAB)) {
          setValue(`${t.replace(HAlF_TAB, "")}`)
          d = -2
        } else if (t.startsWith(BYTE_TAB)) {
          setValue(`${t.replace(BYTE_TAB, "")}`)
          d = -1
        }
      } else {
        if (t.startsWith(TAB)) {
          setValue(`${t.replace(TAB, `${TAB}${TAB}`)}`)
          d = 4
        } else if (t.startsWith(HAlF_TAB)) {
          setValue(`${t.replace(HAlF_TAB, TAB)}`)
          d = 2
        } else if (t.startsWith(BYTE_TAB)) {
          setValue(`${t.replace(BYTE_TAB, TAB)}`)
          d = 3
        } else {
          setValue(`${TAB}${t}`)
          d = 4
        }
      }

      e.preventDefault()

      setTimeout(() => {
        let position = cursorPosition + d
        elm.focus()
        elm.selectionStart = position
        elm.selectionEnd = position
        // console.log(elm)
      }, 10)
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
      if (!activeRef.current.composition) {
        key = "SEND"
      }
      // if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      //   key = "SEND"
      // } else if (e.key === "Enter" && !e.shiftKey) {
      //   key = ""
    } else if (e.key === "Backspace" && newValue.length === 0) {
      key = "DELETE"
    }

    if (key) {
      e.preventDefault()
      const t = e.target.value
      if (key === "SEND") {
        handleEnter(t)
      } else if (key === "DELETE") {
        onDelete?.()
      }
    }
  }

  const onChange = (e: any) => setValue(`${e.target.value}`)

  useEffect(() => {
    if (focusTimeStamp) {
      textareaRef.current.focus()
    } else {
      textareaRef.current.blur()
    }
  }, [focusTimeStamp])

  const handleCompositionStart = () => {
    console.log("com start")
    if (activeRef.current) {
      activeRef.current.composition = true
    }
  }
  const handleCompositionEnd = () => {
    console.log("com end")
    if (activeRef.current) {
      activeRef.current.composition = false
    }
  }
  return {
    value,
    textareaProps: {
      ref: textareaRef,
      onChange: onChange,
      onKeyDown: handleKeyDown,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
    handleEnter,
    handleChange,
  }
}
