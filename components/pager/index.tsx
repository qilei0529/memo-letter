"use client"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { InputerView } from "./inputer"

const letter = `先生亲启：
  见字如面，好久不见！
  人与人的羁绊本就薄如蝉翼，相逢一程已是感激万分。
  曾经总抱怨原来人和人之间的关系浅薄，为什么没有绝对的永远，没有真正的来日方长好像舍弃，离别，放弃，总是充屎着人生，要去做一些不得不的决定，这些问题我想破了脑袋。
  但是现在不这么想了，现在的我逢人就说，遇见的人，遇见的事情都有它的道理，就像曾经遇见的人，带给你好的一切都还在影响你，虽然以后不同路了，但是陪伴你，成长过一段路，就已经很好了。没有所谓的来日方长，所以我们应过好现在。
  清醒点，是你困住了自己，不是别人。
  有些人出现的意义，也许只会教会你一些什么，学会云秀人与人之间只有一段路的缘分。



→  如雪  
→  2024.4.3  
`
const track = `如雪
2024.4.3
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

  const { letterVos, letterList } = useMemo(() => {
    const { list, vos } = transLetterToPos(letter, track)
    return {
      letterVos: vos,
      letterList: list,
    }
  }, [])
  return (
    <div className={cn(`min-h-[800px]`, "bg-[#F3E7D9] w-[640px] relative")}>
      <div
        className={cn(
          `the_font_${font} the_font_none_smooth1`,
          `min-h-[700px] bg-blue-3001`,
          "absolute flex flex-col left-[140px] top-[40px] w-[420px] text-[#31271C] text-[20px] leading-[30px]"
        )}
      >
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
              style={{
                left: `${pos.x * 10}px`,
                top: `${pos.y * 30}px`,
              }}
            >
              {text}
            </span>
          )
        })}
        <div className="flex-1"></div>
      </div>
      <div className="w-[60px] the_font_005">
        {list.map((item) => {
          return (
            <div
              key={item}
              className={font === item ? "bg-red-200  pl-2" : " pl-2"}
              onClick={() => setFont(`${item}`)}
            >
              {item}
            </div>
          )
        })}
      </div>
      <InputerView />
    </div>
  )
}

function transLetterToPos(letter: string, track: string) {
  const vos: any = {}
  const list: string[] = []
  let sections = letter.split("\n")
  let x = 0
  let y = 0
  sections.forEach((section, n) => {
    if (section.length) {
      if (section.startsWith("→  ")) {
        let len = section.length
        if (len) {
          x = 42
          // 靠右显示
          let sublist = []
          for (let i = len - 1; i >= 3; i--) {
            const text = section[i]
            x -= getWidth(text)
            if (x > 41) {
              // 这里 如果很长的话有点意思
              // 会有 bug
              // x = 0
              // y += 1
            }

            const pos = { x: x, y: y }
            const key = `${y}_${x}`
            sublist.unshift(key)
            const item = {
              pos: pos,
              text: text,
              section: n,
            }
            vos[key] = item
          }
          sublist.forEach((item) => {
            list.push(item)
          })
        }
      } else {
        x = 0
        for (let i = 0; i < section.length; i++) {
          const text = section[i]
          if (isChinesePunctuation(text)) {
          } else if (x > 40) {
            x = 0
            y += 1
          }
          // 如果第一位是标点，就放到前一行的最后

          const pos = { x: x, y: y }
          const key = `${y}_${x}`
          list.push(key)
          const item = {
            pos: pos,
            text: text,
            section: n,
          }
          vos[key] = item
          x += getWidth(text)
        }
      }
    }
    y += 1
  })

  return {
    vos,
    list,
  }
}

function getWidth(char: string) {
  if (isChinese(char)) {
    return 2
  }
  if (isChinesePunctuation(char)) {
    return 2
  }
  return 1
}

function isChinese(char: string) {
  return /^[\u4e00-\u9fa5]$/.test(char)
}

function isChinesePunctuation(char: string) {
  return /[\u3001\u3002\uFF0C\uFF1F\uFF01]/.test(char)
}
