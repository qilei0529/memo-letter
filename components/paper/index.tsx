"use client"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { InputerView } from "./inputer"
import { transLetterToPos, useLetterHook } from "@/client/hooks/use-letter-hook"
import { KeyBinder } from "./key-binder"
import { useInputerStore } from "@/client/stores/input-store"
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

export const PaperView = () => {
  const list = [
    "0001",
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
    // "009",
    // "010",
  ]

  const [font, setFont] = useState("0002")

  const { letter, selector, insert, remove } = useLetterHook({ id: "" })
  const onEnter = (str: string, newLine: boolean) => {
    console.log(str, newLine)
    insert(str, newLine)
  }

  const onDelete = (flag: boolean) => {
    remove()
    if (flag) {
      inputFocus(0)
    } else {
      inputFocus()
    }
  }

  const { letterVos, letterList, letterPVos, isEmpty } = useMemo(() => {
    if (letter) {
      const { sections } = letter
      let letterBody = sections.join("\n")
      let isEmpty = false
      if (letterBody.length == 0) {
        letterBody = "亲爱的先生："
        isEmpty = true
      }
      const { list, vos, pvos } = transLetterToPos(letterBody)
      return {
        letterVos: vos,
        letterList: list,
        letterPVos: pvos,
        isEmpty,
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
                isEmpty ? "opacity-30" : "",
                "absolute w-[20px] h-[30px] flex justify-center "
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
                inputFocus()
                toggleShow(true)
                setHoverSection(-1)
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
                  inputFocus()
                  toggleShow(true)
                  setHoverSection(-1)
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

  const setInputValue = useInputerStore((state) => state.setValue)
  const getSelector = useInputerStore((state) => state.getSelector)
  const inputShow = useInputerStore((state) => state.show)
  const toggleShow = useInputerStore((state) => state.toggleShow)
  const setInputAlign = useInputerStore((state) => state.setAlign)

  useEffect(() => {
    if (letter && currentSection !== undefined) {
      const { sections } = letter
      setTimeout(() => {
        let text = sections[currentSection] ?? ""
        const RIGHT = "→  "
        let align = text.startsWith(RIGHT)
        setInputAlign(align ? "RIGHT" : "LEFT")
        setInputValue(text.replace(RIGHT, ""))
      }, 100)
    }
  }, [currentSection])

  const inputFocus = useInputerStore((state) => state.inputFocus)
  const inputRender = useMemo(() => {
    // selector
    let top = 800

    if (!inputShow) {
      return null
    }
    return (
      <>
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="w-full sm:w-[420px] bg-[rgba(255,255,255,.4)] pointer-events-auto rounded-xl backdrop-blur border-[1px] border-[#ddd] shadow-2xl shadow-[rgba(0,0,0,.1)]"
        >
          <InputerView onDelete={onDelete} onEnter={onEnter} />
        </div>
      </>
    )
  }, [currentSection, inputShow, letterPVos])

  const inputStyle = useMemo(() => {
    if (currentSection && letterPVos) {
      const pvos = letterPVos[currentSection]
      return {
        top: `${pvos.end * 30 + 76}px`,
      }
    }
    return {}
  }, [currentSection, letterPVos])

  const keyRender = useMemo(() => {
    if (!letter) {
      return null
    }
    return (
      <KeyBinder
        onAction={(type) => {
          if (type === "ENTER") {
            onEnter("", true)
          } else if (type === "DELETE") {
            onDelete(true)
          } else if (type === "UP") {
            // onDelete(true)
            const selectorData = getSelector(letter.id)
            const section = selectorData?.section
            if (section !== undefined) {
              selector.update(section - 1)
            }
          } else if (type === "DOWN") {
            // onDelete(true)
            console.log("down")
            if (letter) {
              const selectorData = getSelector(letter.id)
              const section = selectorData?.section
              if (section !== undefined) {
                selector.update(section + 1)
              } else {
                selector.update(0)
              }
            }
          }
        }}
      />
    )
  }, [letter])

  return (
    <>
      <div
        className={cn(
          "relative w-[460px] sm:w-[540px] h-[640px] sm:h-[800px] "
        )}
        onClick={() => {
          selector.update(-1)
          toggleShow(false)
        }}
      >
        <div className="absolute w-[640px] bg-[#F3E7D9] top-0 left-[-80px] h-[800px] select-none"></div>
        <div
          className={cn(
            `the_font_${font} the_font_none_smooth1`,
            `bg-blue-3001 h-[700px]`,
            // "select-none",
            "absolute flex flex-col left-[20px] sm:left-[60px] top-[40px] w-[420px] text-[#31271C] text-[20px] leading-[30px]"
          )}
          onMouseLeave={() => setHoverSection(-1)}
        >
          {hoverSectionRender}
          {letterRender}
        </div>
        <div
          className={cn("relative w-[60px] z-30 left-[-80px]", `the_font_0002`)}
        >
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
        <div className="absolute left-[20px] sm:left-[60px]" style={inputStyle}>
          {inputRender}
          {keyRender}
        </div>
      </div>
      <div className="sm:h-[100px]"></div>
    </>
  )
}
