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
      let key = ""
      if (e.key === "Backspace") {
        console.log("out delete")
        key = "DELETE"
      } else if (e.key === "Enter") {
        console.log("out enter")
        key = "ENTER"
      } else if (e.key === "ArrowUp" || e.key === "k") {
        console.log("用户按下了上箭头键")
        key = "UP"
      } else if (e.key === "ArrowDown" || e.key === "j") {
        console.log("用户按下了下箭头键")
        key = "DOWN"
      } else if (e.key === "Escape") {
        console.log("Escape key pressed")
        key = "ESC"
      } else if (e.key === "i") {
        key = "EDIT"
      }

      if (key) {
        onAction(key)
        e.preventDefault()
      }
    }
  }
  return <></>
}
