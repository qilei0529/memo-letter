"use client"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { InputerView } from "./inputer"
import { transLetterToPos, useLetterHook } from "@/client/hooks/use-letter-hook"
import { KeyBinder } from "./key-binder"
import { useInputerStore } from "@/client/stores/input-store"

const LETTER = `先生亲启：
  见字如面，好久不见！
`

export const PaperView = () => {
  const [font, setFont] = useState("0002")

  const [hoverSection, setHoverSection] = useState(-1)

  const inputShow = useInputerStore((state) => state.show)
  const setInputValue = useInputerStore((state) => state.setValue)
  const getSelector = useInputerStore((state) => state.getSelector)
  const toggleShow = useInputerStore((state) => state.toggleShow)
  const setInputAlign = useInputerStore((state) => state.setAlign)

  const { letter, selector, insert, remove } = useLetterHook({ id: "" })

  const onEnter = (str: string, newLine: boolean) => insert(str, newLine)
  const onUpdate = (str: string, newLine: boolean) => insert(str, newLine, true)

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
        letterBody = LETTER
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

  const currentSection = useMemo(() => {
    if (letter) {
      return selector.value?.section
    }
    return undefined
  }, [selector, letter])

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
    if (!inputShow) {
      return null
    }
    return (
      <>
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="w-[100%] sm:w-[420px] bg-[rgba(255,255,255,.4)] pointer-events-auto rounded-xl backdrop-blur border-[1px] border-[#ddd] shadow-2xl shadow-[rgba(0,0,0,.1)]"
        >
          <InputerView
            onDelete={onDelete}
            onEnter={onEnter}
            onChangeValue={onUpdate}
          />
        </div>
      </>
    )
  }, [currentSection, inputShow, letterPVos])

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      let isMobile = window.innerWidth < 640
      setIsMobile(isMobile)
    }
    window.addEventListener("resize", checkMobile)
    checkMobile()
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const inputStyle = useMemo(() => {
    if (currentSection !== undefined && letterPVos) {
      const pvos = letterPVos[currentSection]

      const h = isMobile ? 24 : 30
      const offset = isMobile ? 68 : 76
      return {
        top: `${pvos.end * h + offset}px`,
      }
    }
    return {}
  }, [currentSection, letterPVos, isMobile])

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
          } else if (type === "ESC") {
            toggleShow(false)
            inputFocus(0)
          } else if (type === "EDIT") {
            toggleShow(true)
            inputFocus()
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

  const hoverSectionRender = useMemo(() => {
    if (letterPVos) {
      return (
        <>
          {letterPVos.map((p, index) => {
            const style = {
              // top: `${p.start * 30}px`,
              // left: 0,
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
                className={cn(bg, "w-[420px] relative opacity-30 rounded-md")}
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

  const letterRender = useMemo(() => {
    return (
      <>
        {letterList.map((key) => {
          const item = letterVos[key]
          const { text, pos, section, width } = item
          return (
            <span
              key={key}
              data-section={section}
              className={cn(
                isEmpty ? "opacity-30" : "",
                width === 1 ? "w-[10px] " : "w-[20px]",
                "absolute h-[30px] flex justify-center "
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

  return (
    <>
      <div
        className={cn("relative w-screen h-screen flex flex-col items-center")}
        onClick={() => {
          selector.update(-1)
          toggleShow(false)
        }}
      >
        {/* one piece */}
        <div className="relative w-full sm:w-[640px]">
          {/* scroller */}
          <div
            className={cn(
              "relative sm:w-[640px]",
              "overflow-x-auto sm:overflow-x-visible",
              isMobile ? "min-h-[640px]" : "sm:min-h-[800px]"
            )}
          >
            <div
              className={cn(
                "relative sm:w-[640px] bg-red-100",
                isMobile
                  ? "h-[640px] w-full flex flex-row justify-center"
                  : "sm:min-h-[800px]"
              )}
            >
              {/* theme */}
              <div
                className={cn(
                  "absolute w-[640px] bg-[#F3E7D9] top-[0px] left-[0px] h-[800px]",
                  "select-none origin-top-left scale-[.8] sm:scale-100"
                )}
              ></div>
              {/* paper */}
              <div className="w-[332px] sm:w-full relative">
                <div
                  className={cn(
                    `absolute the_font_${font} the_font_none_smooth1`,
                    "origin-top-left scale-[0.8] sm:scale-100",
                    isMobile
                      ? "left-[0px] top-[32px]"
                      : "left-[160px] top-[40px]",
                    "flex flex-col w-[420px] text-[#31271C] text-[20px] leading-[30px]"
                  )}
                  onMouseLeave={() => setHoverSection(-1)}
                >
                  {hoverSectionRender}
                  {letterRender}
                </div>
              </div>
            </div>
          </div>
          <div className="sm:h-[100px]"></div>
          {/* inputer */}
          <div
            className="absolute w-full left-0 sm:left-[160px]"
            style={inputStyle}
          >
            {inputRender}
            {keyRender}
          </div>
        </div>
      </div>
    </>
  )
}
