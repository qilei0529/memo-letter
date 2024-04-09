import React, { useEffect, useMemo, useRef } from "react"

import { useInputerStore } from "@/client/stores/input-store"
import { Icons } from "@/shared/icons"
import { cn } from "@/lib/utils"

export function InputerView({ onEnter, onDelete, onChangeValue }: any) {
  const textareaRef = useRef<any>(null)
  const activeRef = useRef<{ composition?: boolean }>({})

  const value = useInputerStore((state) => state.value)
  const align = useInputerStore((state) => state.align)
  const focusTimeStamp = useInputerStore((state) => state.focusTimeStamp)
  const setValue = useInputerStore((state) => state.setValue)
  const toggleActive = useInputerStore((state) => state.toggleActive)
  const toggleShow = useInputerStore((state) => state.toggleShow)
  const setAlign = useInputerStore((state) => state.setAlign)

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

  const handleChange = (str: string, align: string) => {
    const RIGHT = "→  "
    const text = `${align === "RIGHT" ? RIGHT : ""}${str}`
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

  const textStyle = useMemo(() => {
    if (value.length > 100) {
      return {
        height: "124px",
      }
    }
    if (value.length > 60) {
      return {
        height: "100px",
      }
    }
    return {
      height: "56px",
    }
  }, [value])

  return (
    <div className="flex flex-row p-2 space-x-2">
      <div className="w-full flex flex-col flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={textStyle}
          className="flex w-full rounded-lg bg-[rgba(255,255,255,.6)] px-2 resize-none appearance-none bg-none text-[16px] py-1"
        />
      </div>
      <div className="w-[48px] text-[#000000]">
        <div
          onClick={() => handleEnter(value)}
          className="flex flex-col h-[32px] justify-center items-center text-[12px] text-blue-700 bg-blue-200 rounded-lg hover:bg-blue-300 cursor-pointer"
        >
          <div className="flex flex-row items-center justify-center ">
            <Icons.write className="w-3.5 h-3.5 stroke-[3px]" />
          </div>
        </div>
        <div className="flex flex-row pt-1">
          <div className="flex-1"></div>
          <div
            onClick={() => {
              const nextAlign = align === "RIGHT" ? "LEFT" : "RIGHT"
              setAlign(nextAlign)
              handleChange(value, nextAlign)
            }}
            className={cn(
              align === "RIGHT"
                ? "bg-red-200 hover:bg-red-300"
                : "bg-gray-200 hover:bg-gray-300",
              "w-5 h-5 flex flex-row items-center justify-center rounded-md cursor-pointer"
            )}
          >
            <Icons.alignRight className="w-3.5 h-3.5 stroke-[2px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
