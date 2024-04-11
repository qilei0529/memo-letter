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
}: {
  index: number
  start: number
  letterBoxs: BoxItem[]
  letterList: string[]
  letterVos: any
  isEmpty?: boolean
}) {
  const updateHoverSection = useSelectStore((state) => state.updateHoverSection)
  const inputFocus = useInputerStore((state) => state.inputFocus)
  const toggleShow = useInputerStore((state) => state.toggleShow)

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
            console.log(item)
          }}
          onDoubleClick={(item) => {
            selector.update(item.section)
            inputFocus()
            toggleShow(true)
          }}
        />
      )
    }
    return null
  }, [letterBoxs, selector.value])

  const letterRender = useMemo(() => {
    return (
      <>
        {letterList.map((key) => {
          const item = letterVos[key]
          const { text, pos, section, size } = item
          return (
            <span
              key={key}
              data-section={section}
              className={cn(
                isEmpty ? "opacity-30" : "",
                size === 1 ? "w-[10px] " : "w-[20px]",
                "absolute h-[30px] flex justify-center "
              )}
              onMouseEnter={(e) => {
                e.stopPropagation()
                updateHoverSection(`${pageIndex}_${section}`)
              }}
              onClick={(e) => {
                e.stopPropagation()
                selector.update(section)
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                selector.update(section)
                inputFocus()
                toggleShow(true)
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
