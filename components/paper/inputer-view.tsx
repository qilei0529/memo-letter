import React, { useMemo } from "react"

import { useInputerStore } from "@/client/stores/input-store"
import { Icons } from "@/shared/icons"
import { cn } from "@/lib/utils"
import { useInputerHook } from "@/client/hooks/use-inputer-hook"
import { useSelectStore } from "@/client/stores/select-store"
import { useSelectHook } from "@/client/hooks/use-select-hook"

export function InputerView({
  onEnter,
  onDelete,
  onChangeValue,
  onKeyAction,
  onChangeAlign,
}: any) {
  const value = useInputerStore((state) => state.value)
  const align = useInputerStore((state) => state.align)
  const setAlign = useInputerStore((state) => state.setAlign)
  const { textareaProps, handleChange, handleEnter, isFocus } = useInputerHook({
    onEnter,
    onDelete,
    onChangeValue,
    onKeyAction,
    onChangeAlign,
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
    <div className="flex flex-row p-2 space-x-2 justify-end">
      <div className="absolute top-[-30px] left-0 flex flex-col flex-1">
        <input
          value={value}
          {...textareaProps}
          // className="flex w-full text-nowrap rounded-lg bg-[rgba(255,255,255,.6)] px-2 resize-none appearance-none bg-none text-[16px] py-1"
          className="flex opacity-0 w-[0px] h-[0px] text-nowrap px-2 bg-none text-[16px] py-1 absolute left-[20px]"
        />
        {isFocus ? (
          <div className="absolute h-[20px] bg-slate-700 w-[2px] animate-blink"></div>
        ) : null}
      </div>
      <div className=" text-[#000000]">
        <div
          onClick={() => handleEnter(value)}
          className="hidden flex-col h-[32px] justify-center items-center text-[12px] text-blue-700 bg-blue-200 rounded-lg hover:bg-blue-300 cursor-pointer"
        >
          <div className="flex flex-row items-center justify-center ">
            <Icons.write className="w-3.5 h-3.5 stroke-[3px]" />
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="flex-1"></div>
          <div
            onClick={() => {
              onKeyAction("TAB")
            }}
            className={cn(
              "bg-gray-200 hover:bg-gray-300",
              "hidden w-5 h-5 flex-row items-center justify-center rounded-md cursor-pointer"
            )}
          >
            <Icons.indent className="w-3.5 h-3.5 stroke-[2px]" />
          </div>
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
