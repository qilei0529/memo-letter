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
      if (e.key === "Backspace") {
        console.log("out delete")
        onAction("DELETE")
      }
      if (e.key === "Enter") {
        console.log("out enter")
        onAction("ENTER")
      }
    }
  }
  return <></>
}
