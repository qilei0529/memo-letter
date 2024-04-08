import { useInputerStore } from "@/client/stores/input-store"
import { useEffect } from "react"

export function KeyBinder({ onAction }: { onAction: (type: string) => void }) {
  useEffect(() => {
    const elm = document.body
    elm.removeEventListener("keydown", handleBodyKeyDown)
    elm.addEventListener("keydown", handleBodyKeyDown)
    return () => {
      elm.removeEventListener("keydown", handleBodyKeyDown)
    }
  }, [])

  const handleBodyKeyDown = (e: any) => {
    const { active } = useInputerStore.getState()
    if (!active) {
      // 如果没有焦点？
      // console.log(e)
      let type = ""
      if (e.key === "Backspace") {
        console.log("out delete")
        type = "DELETE"
      } else if (e.key === "Enter") {
        console.log("out enter")
        type = "ENTER"
      } else if (e.key === "ArrowUp") {
        console.log("用户按下了上箭头键")
        type = "UP"
      } else if (e.key === "ArrowDown") {
        console.log("用户按下了下箭头键")
        type = "DOWN"
      }
      if (type) {
        onAction(type)
        e.preventDefault()
      }
    }
  }
  return <></>
}
