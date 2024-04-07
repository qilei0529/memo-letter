import React, { useEffect, useRef, useState } from "react"

import { Textarea } from "../ui/textarea"
import { useInputerStore } from "@/client/stores/input-store"

export function InputerView({ onEnter, onDelete }: any) {
  const textareaRef = useRef<any>(null)

  const value = useInputerStore((state) => state.value)
  const align = useInputerStore((state) => state.align)
  const focusTimeStamp = useInputerStore((state) => state.focusTimeStamp)
  const setValue = useInputerStore((state) => state.setValue)
  const setActive = useInputerStore((state) => state.setActive)

  const handleFocus = () => {
    setActive(true)
  }

  const handleBlur = () => {
    setActive(false)
  }

  const handleEnter = (str: string) => {
    const RIGHT = "→  "
    const text = `${align === "RIGHT" ? RIGHT : ""}${str}`
    console.log(align)
    onEnter?.(text)
    // clear
    setValue("")
  }

  const handleKeyDown = (e: any) => {
    let key = ""
    const { value: newValue } = useInputerStore.getState()
    if (e.key === "Enter" && !e.shiftKey) {
      key = "SEND"
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

  return (
    <div className="w-[240px] h-[80px] bg-white">
      <Textarea
        ref={textareaRef}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}
