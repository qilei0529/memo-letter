"use client"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { InputerView } from "./inputer"
import { transLetterToPos, useLetterHook } from "@/client/hooks/use-letter-hook"

const LETTER = `先生亲启：
  见字如面，好久不见！
  人与人的羁绊本就薄如蝉翼，相逢一程已是感激万分。
  曾经总抱怨原来人和人之间的关系浅薄，为什么没有绝对的永远，没有真正的来日方长好像舍弃，离别，放弃，总是充屎着人生，要去做一些不得不的决定，这些问题我想破了脑袋。
  但是现在不这么想了，现在的我逢人就说，遇见的人，遇见的事情都有它的道理，像曾经遇见的人，带给你好的一切都还在影响你，虽然以后不同路了，但是陪伴你，成长过一段路，就已经很好了。没有所谓的来日方长，所以我们应过好现在。
  清醒点，是你困住了自己，不是别人。
  有些人出现的意义，也许只会教会你一些什么，学会云秀人与人之间只有一段路的缘分。



→  如雪  
→  2024.4.3  
`

export const PagerView = () => {
  const list = [
    "000",
    "0002",
    "0003",
    // "001",
    // "002",
    // "003",
    // "004",
    // "005",
    // "006",
    // "007",
    // "008",
    "009",
    "010",
  ]

  const [font, setFont] = useState("0002")

  const { letter, selector, insert, remove } = useLetterHook({ id: "" })
  const onEnter = (str: string, newLine: boolean) => {
    insert(str, newLine)
  }

  const onDelete = (flag: boolean) => {
    remove()
    if (flag) {
      setFocusState(0)
    } else {
      setFocusState(new Date().getTime())
    }
  }

  const { letterVos, letterList, letterPVos } = useMemo(() => {
    if (letter) {
      const { sections } = letter
      let letterBody = sections.join("\n")
      const { list, vos, pvos } = transLetterToPos(letterBody)
      return {
        letterVos: vos,
        letterList: list,
        letterPVos: pvos,
      }
    }
    return {
      letterList: [],
    }
  }, [letter])

  const letterRender = useMemo(() => {
    return (
      <>
        {letterList.map((key) => {
          const item = letterVos[key]
          const { text, pos, section } = item
          return (
            <span
              key={key}
              data-section={section}
              className={cn(
                "absolute top-0 w-[20px] h-[30px] bg-red-4001 flex items-center1"
              )}
              onMouseEnter={(e) => {
                e.stopPropagation()
                setHoverSection(section)
              }}
              onClick={(e) => {
                e.stopPropagation()
                selector.update(section)
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                selector.update(section)
                setFocusState(new Date().getTime())
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

  const currentSection = useMemo(() => {
    if (letter) {
      const { sections } = letter
      return selector.value?.section
    }
    return undefined
  }, [selector, letter])

  const [hoverSection, setHoverSection] = useState(-1)

  const hoverSectionRender = useMemo(() => {
    if (letterPVos) {
      return (
        <>
          {letterPVos.map((p, index) => {
            const style = {
              top: `${p.start * 30}px`,
              left: 0,
              height: `${(p.end - p.start + 1) * 30}px`,
            }
            const bg =
              currentSection === index
                ? "bg-red-300"
                : hoverSection === index
                ? "bg-red-200"
                : ""
            return (
              <div
                key={index}
                className={cn(bg, "w-[420px] absolute opacity-30 rounded-md")}
                onMouseEnter={(e) => {
                  e.stopPropagation()
                  setHoverSection(index)
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  selector.update(index)
                  setFocusState(new Date().getTime())
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  selector.update(index)
                }}
                style={style}
              ></div>
            )
          })}
        </>
      )
    }
    return null
  }, [hoverSection, currentSection, letterPVos])

  const curSectionValue = useMemo(() => {
    if (letter && currentSection !== undefined) {
      const { sections } = letter
      return sections[currentSection] ?? ""
    }
    return ""
  }, [currentSection])

  const [focusState, setFocusState] = useState(0)

  const inputRender = useMemo(() => {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <InputerView
          text={curSectionValue}
          onDelete={onDelete}
          onEnter={onEnter}
          focusState={focusState}
        />
      </div>
    )
  }, [currentSection, focusState, curSectionValue])

  return (
    <>
      <div
        className={cn("bg-[#F3E7D9] w-[640px] relative")}
        style={{
          height: "800px",
        }}
        onClick={() => selector.update(-1)}
      >
        <div
          className={cn(
            `the_font_${font} the_font_none_smooth1`,
            `bg-blue-3001`,
            // "select-none",
            "absolute flex flex-col left-[140px] top-[40px] w-[420px] text-[#31271C] text-[20px] leading-[30px]"
          )}
          onMouseLeave={() => setHoverSection(-1)}
          style={{
            height: "700px",
          }}
        >
          {hoverSectionRender}
          {letterRender}
        </div>
        <div className={cn("w-[60px]", `the_font_0002`)}>
          {list.map((item) => {
            return (
              <div
                key={item}
                className={cn(
                  font === item
                    ? "bg-red-200  pl-2"
                    : " pl-2 hover:bg-slate-200",
                  "cursor-pointer"
                )}
                onClick={() => setFont(`${item}`)}
              >
                {item}
              </div>
            )
          })}
        </div>
        {/* inputer */}
        {inputRender}
      </div>
      <div className="h-[400px]"></div>
    </>
  )
}
