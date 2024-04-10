import React, { useMemo } from "react"

import { useInputerStore } from "@/client/stores/input-store"
import { Icons } from "@/shared/icons"
import { cn } from "@/lib/utils"
import { useInputerHook } from "@/client/hooks/use-inputer-hook"

export function InputerView({ onEnter, onDelete, onChangeValue }: any) {
  const value = useInputerStore((state) => state.value)
  const align = useInputerStore((state) => state.align)
  const setAlign = useInputerStore((state) => state.setAlign)
  const { textareaProps, handleChange, handleEnter } = useInputerHook({
    onEnter,
    onDelete,
    onChangeValue,
  })

  const textStyle = useMemo(() => {
    if (value.length > 100) {
      return {
        height: "124px",
      }
    }
    if (value.length > 50) {
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
          value={value}
          {...textareaProps}
          style={textStyle}
          className="flex w-full rounded-lg bg-[rgba(255,255,255,.6)] px-2 resize-none appearance-none bg-none text-[16px] py-1"
        />
      </div>
      <div className="w-[42px] text-[#000000]">
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
