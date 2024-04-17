"use client"
import FontFaceObserver from "fontfaceobserver"
import {
  BoxItem,
  BlockItem,
  isChinese,
  isChinesePunctuation,
  isNormalText,
  isChinesePunctuationBig,
} from "@/client/hooks/use-letter-hook"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function PaperCanvas({
  index: pageIndex,
  start,
  letterBoxs,
  letterList,
  letterVos,
  isEmpty,
}: {
  index: number
  start: number
  letterBoxs: BoxItem[]
  letterList: string[]
  letterVos: { [key: string]: BlockItem }
  isEmpty?: boolean
}) {
  const canvasRef = useRef(null)

  const [status, setStatus] = useState("WAIT")

  const size = {
    width: 500,
    height: 800,
  }

  const renderText = (data: BlockItem[]) => {
    const canvas = canvasRef.current as any
    if (canvas) {
      const ctx = canvas.getContext("2d")

      // 在指定位置绘制文字
      // ctx.fillText("Hello, World!", 50, 50)
      const offset = { x: 50, y: 63 }
      const ratio = 2
      ctx.clearRect(0, 0, size.width * ratio, size.height * ratio)
      data.forEach((item) => {
        const { pos } = item
        const d =
          isChinese(item.text) || isChinesePunctuationBig(item.text)
            ? 0
            : isChinesePunctuation(item.text)
            ? -2
            : -6
        const x = (pos.x * 10 + offset.x + d) * ratio
        const y = (pos.y * 30 + offset.y) * ratio
        // 设置文字样式
        ctx.font = "40px FontSystem"

        ctx.fillStyle = "black"
        ctx.textAlign = "center"

        ctx.fillText(item.text, x, y)
      })
    }
  }

  useEffect(() => {
    if (status === "READY") {
      const list: any[] = letterList.map((key) => letterVos[key])
      renderText(list)
    }
  }, [letterList])

  useEffect(() => {
    if (status === "READY") {
      const list: any[] = letterList.map((key) => letterVos[key])
      renderText(list)
    }
  }, [status])

  useEffect(() => {
    let count = 0
    const init = async () => {
      var font = new FontFaceObserver("FontSystem")
      font
        .load()
        .then(function () {
          console.log("FontSystem has loaded.")
          setStatus("READY")
        })
        .catch(() => {
          // FontFaceObserver 会有一个 3 秒超时检测
          console.log("error load", count)
          if (count < 3) {
            init()
          } else {
            setStatus("ERROR")
          }
        })
    }
    init()
  }, [])

  const render = useMemo(() => {
    if (status === "ERROR") {
      return (
        <div className="w-full h-[400px] flex flex-row items-center justify-center">
          <span className="text-[14px] bg-opacity-50 bg-red-200 px-2 rounded-md text-slate-600 text-opacity-50">
            字体加载异常，请刷新重试。
          </span>
        </div>
      )
    }
    if (status === "READY") {
      return (
        <canvas
          className={cn(
            isEmpty ? "opacity-35" : "",
            "paper-canvas w-full h-full"
          )}
          ref={canvasRef}
          width={size.width * 2}
          height={size.height * 2}
        />
      )
    }
    return (
      <div className="w-full h-[400px] flex flex-row items-center justify-center">
        <span className="text-[14px] bg-opacity-50 bg-red-200 px-2 rounded-md text-slate-600 text-opacity-50">
          字体加载中...
        </span>
      </div>
    )
  }, [status, isEmpty])

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
      }}
      className="absolute top-[-40px] left-[-40px] pointer-events-none"
    >
      {render}
    </div>
  )
}
