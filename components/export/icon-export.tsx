"use client"

import { cn } from "@/lib/utils"
import { Icons } from "@/shared/icons"
import { useState } from "react"
import { format } from "date-fns"

export const IconExport = () => {
  const onClick = () => {
    const list = document.querySelectorAll(".paper-canvas") as any
    setStatus("PENDING")
    if (list && list.length) {
      list.forEach((item: Element | any) => {
        const dataURL = item.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.href = dataURL
        const now = new Date()
        downloadLink.download = `信_${format(now, "yyyy_MM_dd")}.png`

        // wait 1000ms for user exp
        setTimeout(() => {
          downloadLink.click()
          setStatus("WAIT")
        }, 1000)
      })
    }
  }

  const [status, setStatus] = useState("WAIT")

  return (
    <div
      onClick={onClick}
      className={cn(
        status === "PENDING" ? "" : "",
        "w-8 h-8 cursor-pointer bg-white rounded-2xl flex flex-row items-center justify-center text-slate-400 hover:text-slate-600"
      )}
    >
      {status === "PENDING" ? (
        <Icons.spinner className="relative w-5 h-5 animate-spin" />
      ) : (
        <Icons.download className="relative w-5 h-5" />
      )}
    </div>
  )
}
