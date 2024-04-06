import { Textarea } from "../ui/textarea"

export const InputerView = () => {
  return (
    <div className="absolute left-[140px] top-[670px]">
      <div className="w-[240px] h-[80px] bg-white">
        <MyTextarea />
      </div>
    </div>
  )
}

import React, { useRef } from "react"

function MyTextarea() {
  const textareaRef = useRef<any>(null)

  const handleFocus = () => {
    textareaRef.current.addEventListener("keydown", handleKeyDown)
  }

  const handleBlur = () => {
    textareaRef.current.removeEventListener("keydown", handleKeyDown)
  }

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      console.log("Cmd + Enter pressed while focused")
      // 在这里处理 cmd + enter 事件
    }
  }

  return (
    <Textarea ref={textareaRef} onFocus={handleFocus} onBlur={handleBlur} />
  )
}
