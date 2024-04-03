"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"

const FONT_MAP = {
  A1: "Mengshen-Handwritten",
  A2: "JasonWriting2",
  A3: "ziquchuangketie",
}

export const PagerView = () => {
  const list = ["001", "002", "004", "005", "007", "008"]

  const [font, setFont] = useState("009")

  const height = 800
  const innerHeight = 700

  return (
    <div
      className={cn(`min-h-[${height}px]`, "bg-[#F3E7D9] w-[640px] relative")}
    >
      <div
        className={cn(
          `the_font_${font} the_font_none_smooth`,
          `min-h-[700px]`,
          "absolute flex flex-col left-[140px] top-[40px] w-[420px] text-[#31271C] text-[20px] leading-[30px]"
        )}
        onClick={() => {
          const index = list.indexOf(font)
          let next = index + 1
          if (next >= list.length) {
            next = 0
          }
          console.log(index)

          setFont(list[next])
        }}
      >
        <div className="mb-4">先生亲启：</div>
        <div className="indent-10 text-justify">见字如面，好久不见！</div>
        <div className="indent-10 text-justify">
          人与人的羁绊本就薄如蝉翼， 相逢一程已是感激万分。
        </div>
        <div className="indent-10 text-justify">
          曾经总抱怨原来人和人之间的关系浅薄，为
          什么没有绝对的永远，没有真正的来日方长好像
          舍弃，离别，放弃，总是充屎着人生，要去做一些不
          得不的决定，这些问题我想破了脑袋。
        </div>
        <div className="indent-10 text-justify">
          但是现在不这么想了，现在的我逢人就说，
          遇见的人，遇见的事情都有它的道理，就像
          曾经遇见的人，带给你好的一切都还在影响你，
          虽然以后不同路了，但是陪伴你，成长过一段路，
          就已经很好了。没有所谓的来日方长，所以我们
          应过好现在。清醒点，是你困住了自己，不是别人。
        </div>
        <div className="indent-10 text-justify">
          有些人出现的意义，也许只会教会你一些什么，
          学会云秀人与人之间只有一段路的缘分。
        </div>
        <div className="indent-10 text-justify hidden">
          先生，姑娘在忙碌，闲暇之余的时
          间里，这已经是第二十七封闲话了。在三言两
          语中，闲来的碎々念浓々淡々浓々， 痴痴绵绵，绵绵痴痴，都是纸短情长，也
          是姑娘喜欢的此前后生的日常。如顾城
          说的那样，多么希望，有一个门口早晨，阳
          光照在草上，我们站着扶着自己的门窗，门
          很低，但太阳是明亮的，草在结它的种
          子，风在摇它的叶子，我们站着，不说话，
          就十分美好。先生，姑娘是个心思细腻，
          温柔慈善，眉清目秀的女子。是他们见到
          的窈窕淑女，君子好逑，是和蔼可亲，贤
          妻良母类。其实姑娘现在想做个潇潇洒洒，
          棱角分明，醉酒如烟的江湖女，因为这一身
          的单枪匹马没有一件铠甲可依。长夜把心 事说给风听，我想把我说给你听。
        </div>
        <div className="flex-1"></div>
        <div className="flex flex-row">
          <div className="flex-1"></div>
          如雪
          <div className="w-10"></div>
        </div>
        <div className="flex flex-row">
          <div className="flex-1"></div>
          2024.3.4
          <div className="w-10"></div>
        </div>
      </div>
      <div className="w-[60px]">
        {list.map((item) => {
          return (
            <div
              key={item}
              className={font === item ? "bg-red-300" : ""}
              onClick={() => setFont(`${item}`)}
            >
              {item}
            </div>
          )
        })}
      </div>
    </div>
  )
}
