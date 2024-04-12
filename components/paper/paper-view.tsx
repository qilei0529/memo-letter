"use client"
import { useEffect, useMemo, useState } from "react"
import { InputerView } from "./inputer-view"
import { transLetterToPos, useLetterHook } from "@/client/hooks/use-letter-hook"
import { KeyBinderView } from "./key-binder-view"
import { useInputerStore } from "@/client/stores/input-store"
import { useScreenHook } from "@/client/hooks/use-screen-hook"
import { PaperLayout } from "./layout"
import { PapeWapperView } from "./paper-wrapper-view"
import { useSelectHook } from "@/client/hooks/use-select-hook"
import { PaperItemContent } from "./pager-content-view"
import { useFontHook } from "@/client/hooks/use-font-hook"

const LETTER = `先生亲启：
  见字如面，好久不见！
`

export const PaperView = () => {
  // screen
  const { isMobile } = useScreenHook()

  // font
  const { font } = useFontHook()

  const inputShow = useInputerStore((state) => state.show)
  const inputFocus = useInputerStore((state) => state.inputFocus)

  const { letter, insert, remove } = useLetterHook({ id: "" })

  const { selector } = useSelectHook()

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

  const { pages, isEmpty } = useMemo(() => {
    if (letter) {
      const { sections } = letter
      let letterBody = sections.join("\n")
      let isEmpty = false
      if (letterBody.length == 0) {
        letterBody = LETTER
        isEmpty = true
      }
      const { pages } = transLetterToPos(letterBody)
      return {
        pages,
        isEmpty,
      }
    }
    return {
      pages: [],
    }
  }, [letter])

  // useEffect(() => {
  //   if (letter && selector.value) {
  //     const { sections } = letter
  //     setTimeout(() => {
  //       let text = sections[currentSection] ?? ""
  //       let align = text.startsWith(RIGHT)
  //       setInputAlign(align ? Align.right : Align.left)
  //       setInputValue(text.replace(RIGHT, ""))
  //     }, 100)
  //   }
  // }, [currentSection])

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
  }, [inputShow])

  const inputStyle = useMemo(() => {
    if (selector.value && pages.length > 0) {
      const { section } = selector.value
      // length
      if (pages.length) {
        const pageIndex = pages.findLastIndex((item) => {
          return item.start <= section
        })
        const page = pages[pageIndex]
        if (page) {
          const { boxs } = page
          const box = boxs[section - page.start]
          if (box) {
            const h = isMobile ? 24 : 30
            const offset = isMobile ? 68 : 76
            // TODO the page top
            const pageTop = pageIndex * 880
            return {
              top: `${box.end * h + offset + pageTop}px`,
            }
          }
        }
      }
    }
    return {
      display: "none",
    }
  }, [isMobile, selector.value, pages])

  const keyRender = useMemo(() => {
    if (!letter) {
      return null
    }
    return (
      <KeyBinderView
        onAction={(type) => {
          if (type === "ENTER") {
            onEnter("", true)
          } else if (type === "DELETE") {
            onDelete(true)
          } else if (type === "ESC") {
            selector.hideInput()
          } else if (type === "EDIT") {
            selector.showInput()
          } else if (type === "UP") {
            selector.moveUp()
          } else if (type === "DOWN") {
            selector.moveDown()
          }
        }}
      />
    )
  }, [letter])

  const extra = (
    <div className="absolute w-full left-0 sm:left-[160px]" style={inputStyle}>
      {inputRender}
      {keyRender}
    </div>
  )
  const pagesRender = useMemo(() => {
    return (
      <>
        {pages.map((page, index) => {
          const { boxs, list, vos } = page
          return (
            <PapeWapperView key={index} isMobile={isMobile} font={font}>
              <PaperItemContent
                index={index}
                start={page.start}
                letterBoxs={boxs}
                letterList={list}
                letterVos={vos}
                isEmpty={isEmpty}
              />
            </PapeWapperView>
          )
        })}
      </>
    )
  }, [pages, font])

  return (
    <PaperLayout
      onClick={() => {
        selector.hideInput()
      }}
      isMobile={isMobile}
      extra={extra}
    >
      {pagesRender}
      <div className="h-2"></div>
      <div className="sm:h-[100px]"></div>
    </PaperLayout>
  )
}
