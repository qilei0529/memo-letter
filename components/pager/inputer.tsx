import React, { useEffect, useRef, useState } from "react"

import { Textarea } from "../ui/textarea"

export const InputerView = ({ text, onDelete, onEnter, focusState }: any) => {
  return (
    <div className="absolute left-[140px] top-[670px]">
      <div className="w-[240px] h-[80px] bg-white">
        <MyTextarea
          focusState={focusState}
          text={text}
          onDelete={onDelete}
          onEnter={onEnter}
        />
      </div>
    </div>
  )
}

function MyTextarea({ text, onEnter, onDelete, focusState }: any) {
  const textareaRef = useRef<any>(null)
  const focusRef = useRef<any>(false)
  const valueRef = useRef<any>("")

  useEffect(() => {
    const elm = document.body
    elm.removeEventListener("keydown", handleBodyKeyDown)
    elm.addEventListener("keydown", handleBodyKeyDown)
    return () => {
      elm.removeEventListener("keydown", handleBodyKeyDown)
    }
  }, [])

  const handleBodyKeyDown = (e: any) => {
    if (!focusRef.current) {
      // 如果没有焦点？
      // console.log(e)
      if (e.key === "Backspace") {
        console.log("out delete")
        onDelete?.(true)
      }
      if (e.key === "Enter") {
        console.log("out delete")
        onEnter?.("", true)
      }
    }
  }

  const handleFocus = () => {
    focusRef.current = true
  }

  const handleBlur = () => {
    focusRef.current = false
  }

  const handleEnter = (str: string) => {
    onEnter?.(str)
    valueRef.current = ""
    setValue("")
  }

  const handleKeyDown = (e: any) => {
    let key = ""
    if (e.key === "Enter" && !e.shiftKey) {
      key = "SEND"
      // if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      //   key = "SEND"
      // } else if (e.key === "Enter" && !e.shiftKey) {
      //   key = ""
    } else if (e.key === "Backspace" && valueRef.current?.length === 0) {
      console.log("edit delete", valueRef.current)
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

  const [value, setValue] = useState("")

  const onChange = (e: any) => {
    const t = e.target.value
    valueRef.current = t
    setValue(t)
  }

  useEffect(() => {
    valueRef.current = text
    setValue(text)
  }, [text])

  useEffect(() => {
    if (focusState) {
      textareaRef.current.focus()
    } else {
      textareaRef.current.blur()
    }
  }, [focusState])

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onKeyDown={handleKeyDown}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}
