"use client"
import { useEffect, useMemo, useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Icons } from "@/shared/icons"
import { FontLoader } from "./font-loader"
import { useFontHook } from "@/client/hooks/use-font-hook"
import { FontData } from "@/client/stores/font-store"
import axios from "axios"
import FontFaceObserver from "fontfaceobserver"
import { createGlobalStyle } from "styled-components"

export function FontWidget() {
  const { list, font, fontVos, initFont, updateFont } = useFontHook()

  const [selectFont, setSelectFont] = useState("system")

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-8 h-8 bg-white rounded-2xl flex flex-row items-center justify-center text-slate-400 hover:text-gray-600 cursor-pointer">
            <Icons.font className="relative w-5 h-5" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          className="shadow-2xl p-0 mt-[-36px] mr-[56px] border-slate-200 bg-slate-50 rounded-lg w-[160px]"
        >
          <div className="p-2 space-y-1 text-slate-600">
            <div className="text-[14px]">字体</div>
            {list.map((item, key) => {
              return (
                <FontItem
                  onReady={() => {
                    updateFont(item.id, { status: "READY" })
                  }}
                  current={selectFont}
                  item={item}
                  key={key}
                />
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

function FontItem({
  item,
  current,
  onReady,
}: {
  item: FontData
  current: string
  onReady: () => void
}) {
  const [percent, setPercent] = useState(0)
  useEffect(() => {
    if (item.status === "WAIT" && current === item.id) {
      const url = item.path
      axios
        .get(url, {
          onDownloadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) /
                (progressEvent.total ?? item.total ?? 1000000)
            )
            setPercent(percentCompleted)
          },
        })
        .then(() => {
          console.log("ready")
          onReady?.()
        })
    }
  }, [])

  const render = useMemo(() => {
    return (
      <div className="flex flex-row">
        {item.name}
        <>{percent}</>
      </div>
    )
  }, [item.status, percent])
  return <>{render}</>
}
