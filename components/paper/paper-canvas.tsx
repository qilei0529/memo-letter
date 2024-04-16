"use client"
import FontFaceObserver from "fontfaceobserver"
import {
  BoxItem,
  BlockItem,
  isChinese,
  isChinesePunctuation,
  isNormalText,
} from "@/client/hooks/use-letter-hook"
import { useEffect, useRef, useState } from "react"
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
        const x = (pos.x * 10 + offset.x) * ratio
        const y = (pos.y * 30 + offset.y) * ratio
        // 设置文字样式
        ctx.font =
          isNormalText(item.text) ||
          isChinese(item.text) ||
          isChinesePunctuation(item.text)
            ? "40px FontSystem"
            : "32px serif"

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
    var font = new FontFaceObserver("FontSystem")
    font.load().then(function () {
      console.log("FontSystem has loaded.")
      setStatus("READY")
    })
  }, [])

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
      }}
      className="absolute top-[-40px] left-[-40px] pointer-events-none"
    >
      {status === "READY" ? (
        <canvas
          className={cn(
            isEmpty ? "opacity-35" : "",
            "paper-canvas w-full h-full"
          )}
          ref={canvasRef}
          width={size.width * 2}
          height={size.height * 2}
        />
      ) : (
        <div className="w-full h-[400px] flex flex-row items-center justify-center">
          <span className="text-[14px] bg-opacity-50 bg-red-200 px-2 rounded-md text-slate-600 text-opacity-50">
            字体加载中...
          </span>
        </div>
      )}
    </div>
  )
}
