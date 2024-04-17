import { BoxItem } from "@/client/hooks/use-letter-hook"
import { useSelectHook } from "@/client/hooks/use-select-hook"
import { useInputerStore } from "@/client/stores/input-store"
import { ISelectorData, useSelectStore } from "@/client/stores/select-store"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

function BoxSectionView({
  index: pageIndex,
  boxs: letterBoxs,
  current,
  onBoxClick,
  onDoubleClick,
}: {
  index: number
  boxs: BoxItem[]
  current?: ISelectorData
  onBoxClick?: (item: BoxItem, index: number) => void
  onDoubleClick?: (item: BoxItem, index: number) => void
}) {
  const hoverSection = useSelectStore((state) => state.hoverSection)
  const updateHoverSection = useSelectStore((state) => state.updateHoverSection)

  if (letterBoxs) {
    return (
      <>
        {letterBoxs.map((item, index) => {
          const style = {
            height: `${(item.end - item.start + 1) * 30}px`,
          }
          const bg =
            current?.section === item.section
              ? "bg-red-300"
              : hoverSection === `${item.section}`
              ? "bg-red-200"
              : ""
          return (
            <div
              key={index}
              className={cn(bg, "w-[420px] relative opacity-30 rounded-md")}
              onMouseEnter={(e) => {
                e.stopPropagation()
                updateHoverSection(`${item.section}`)
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                // selector.update(index)
                // inputFocus()
                // toggleShow(true)
                updateHoverSection()
                onDoubleClick?.(item, index)
              }}
              onClick={(e) => {
                e.stopPropagation()
                // selector.update(index)
                onBoxClick?.(item, index)
              }}
              style={style}
            ></div>
          )
        })}
      </>
    )
  }
}

export function PaperItemContent({
  index: pageIndex,
  start,
  letterBoxs,
  letterList,
  letterVos,
  isEmpty,
  font,
}: {
  index: number
  start: number
  letterBoxs: BoxItem[]
  letterList: string[]
  letterVos: any
  isEmpty?: boolean
  font?: string
}) {
  const updateHoverSection = useSelectStore((state) => state.updateHoverSection)

  const { selector } = useSelectHook()
  const hoverSectionRender = useMemo(() => {
    if (letterBoxs) {
      return (
        <BoxSectionView
          index={pageIndex}
          current={selector.value}
          boxs={letterBoxs}
          onBoxClick={(item) => {
            selector.update(item.section)
            selector.hideInput()
          }}
          onDoubleClick={(item) => {
            selector.update(item.section)
            selector.showInput()
          }}
        />
      )
    }
    return null
  }, [letterBoxs, selector.value])

  const letterRender = useMemo(() => {
    return (
      <>
        {letterList.map((letterKey) => {
          const item = letterVos[letterKey]
          const { text, pos, section, size } = item
          return (
            <span
              key={letterKey}
              data-section={section}
              className={cn(
                isEmpty ? "opacity-30" : "",
                size === 1 ? "w-[10px] " : "w-[20px]",
                `the_font_${font}`,
                "absolute h-[30px] flex justify-center text-transparent"
              )}
              onMouseEnter={(e) => {
                e.stopPropagation()
                updateHoverSection(`${section}`)
              }}
              onClick={(e) => {
                e.stopPropagation()
                // 获取 当前 位置
                const m = letterList.filter((key) => {
                  const o = letterVos[key]
                  return o.section === item.section
                })
                const index = m.findIndex((key) => key === letterKey)
                selector.update(section, index)
                selector.hideInput()
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                // 获取 当前 位置
                const m = letterList.filter((key) => {
                  const o = letterVos[key]
                  return o.section === item.section
                })
                const index = m.findIndex((key) => key === letterKey)
                selector.update(section, index)
                selector.showInput()
                updateHoverSection()
              }}
              style={{
                left: `${pos.x * 10}px`,
                top: `${pos.y * 30}px`,
              }}
            >
              {text}
            </span>
          )
        })}
      </>
    )
  }, [letterList])

  return (
    <>
      {hoverSectionRender}
      {letterRender}
    </>
  )
}
