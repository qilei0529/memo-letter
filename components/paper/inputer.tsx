import React, { useEffect, useRef, useState } from "react"

import { Textarea } from "../ui/textarea"
import { useInputerStore } from "@/client/stores/input-store"

export function InputerView({ onEnter, onDelete }: any) {
  const textareaRef = useRef<any>(null)

  const value = useInputerStore((state) => state.value)
  const align = useInputerStore((state) => state.align)
  const focusTimeStamp = useInputerStore((state) => state.focusTimeStamp)
  const setValue = useInputerStore((state) => state.setValue)
  const toggleActive = useInputerStore((state) => state.toggleActive)

  const handleFocus = () => {
    toggleActive(true)
  }

  const handleBlur = () => {
    toggleActive(false)
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
    <div className="flex flex-row p-2">
      <div className="w-full sm:w-[360px] flex flex-col">
        <textarea
          ref={textareaRef}
          value={value}
          onKeyDown={handleKeyDown}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex min-h-[82px] w-full rounded-lg resize-none border border-input appearance-none bg-none px-3 py-2 text-[14px] disabled:opacity-50"
        />
        <div className="h-[calc(env(safe-area-inset-bottom)-20px)]"></div>
      </div>
      <div className="w-[60px]"></div>
    </div>
  )
}
