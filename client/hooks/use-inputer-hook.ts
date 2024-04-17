import { useEffect, useMemo, useRef } from "react"
import { useInputerStore } from "../stores/input-store"
import { Align } from "./use-letter-hook"

export const RIGHT = "→  "

export const useInputerHook = ({
  onEnter,
  onDelete,
  onChangeValue,
  onKeyAction,
  onChangeAlign,
}: any) => {
  const textareaRef = useRef<any>(null)
  // const valueRef = useRef<string>("")
  const activeRef = useRef<{ composition?: boolean }>({})

  const value = useInputerStore((state) => state.value)
  const align = useInputerStore((state) => state.align)
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
    console.log("onEnter")
    onEnter?.("")
    setValue("")
  }

  const handleChange = (str: string, align: string) => {
    const text = `${align === Align.right ? RIGHT : ""}${str}`
    onChangeAlign(align)
  }

  const handleKeyDown = (e: any) => {
    let key = ""
    const { value: newValue } = useInputerStore.getState()
    const elm = textareaRef.current
    if (e.key === "Escape") {
      console.log("Escape key pressed")
      key = "ESC"
      toggleActive(false)
      toggleShow(false)
    } else if (e.key === "Ta1") {
      // tab future
      // const cursorPosition = elm.selectionStart
      // key = "TAB"
      // const t = e.target.value
      // let d = 0
      // const TAB = "    "
      // const HAlF_TAB = "  "
      // const BYTE_TAB = " "
      // if (e.shiftKey) {
      //   if (t.startsWith(TAB)) {
      //     setValue(`${t.replace(TAB, "")}`)
      //     d = -4
      //   } else if (t.startsWith(HAlF_TAB)) {
      //     setValue(`${t.replace(HAlF_TAB, "")}`)
      //     d = -2
      //   } else if (t.startsWith(BYTE_TAB)) {
      //     setValue(`${t.replace(BYTE_TAB, "")}`)
      //     d = -1
      //   }
      // } else {
      //   if (t.startsWith(TAB)) {
      //     setValue(`${t.replace(TAB, `${TAB}${TAB}`)}`)
      //     d = 4
      //   } else if (t.startsWith(HAlF_TAB)) {
      //     setValue(`${t.replace(HAlF_TAB, TAB)}`)
      //     d = 2
      //   } else if (t.startsWith(BYTE_TAB)) {
      //     setValue(`${t.replace(BYTE_TAB, TAB)}`)
      //     d = 3
      //   } else {
      //     setValue(`${TAB}${t}`)
      //     d = 4
      //   }
      // }
      // e.preventDefault()
      // setTimeout(() => {
      //   let position = cursorPosition + d
      //   elm.focus()
      //   elm.selectionStart = position
      //   elm.selectionEnd = position
      // }, 10)
    } else {
      if (!activeRef.current.composition) {
        if (e.key === "Enter") {
          key = "SEND"
          // if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          //   key = "SEND"
          // } else if (e.key === "Enter" && !e.shiftKey) {
          //   key = ""
        } else if (e.key === "Backspace" && newValue.length === 0) {
          key = "DELETE"
        } else if (e.key === "ArrowUp") {
          console.log("用户按下了上箭头键")
          key = "UP"
        } else if (e.key === "Tab") {
          console.log("用户按下了 Tab")
          key = "TAB"
        } else if (e.key === "ArrowDown") {
          console.log("用户按下了下箭头键")
          key = "DOWN"
        } else if (e.key === "ArrowLeft") {
          console.log("用户按下了上箭头键")
          key = "LEFT"
        } else if (e.key === "ArrowRight") {
          console.log("用户按下了下箭头键")
          key = "RIGHT"
        }
      }
    }

    if (key) {
      console.log(key)
      e.preventDefault()
      const t = e.target.value
      if (key === "SEND") {
        handleEnter(t)
      } else if (key === "DELETE") {
        onDelete?.()
      } else {
        onKeyAction?.(key)
      }
    }
  }

  const onChange = (e: any) => {
    const value = e.target.value
    console.log(value)
    if (activeRef.current.composition) {
      setValue(value)
    } else {
      setValue("")
      onChangeValue(value)
    }
  }

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
      setValue("")
      onChangeValue(textareaRef.current.value)
    }
  }

  const isFocus = useMemo(() => {
    return focusTimeStamp > 0
  }, [])

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
    isFocus,
  }
}
