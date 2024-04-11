import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function PaperLayout({
  isMobile,
  onClick,
  children,
  extra,
}: {
  isMobile: boolean
  onClick?: () => void
  children: ReactNode
  extra?: ReactNode
}) {
  return (
    <div
      className={cn("relative w-screen h-screen flex flex-col items-center")}
      onClick={() => {
        // selector.update(-1)
        // toggleShow(false)
        onClick?.()
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
          {children}
        </div>
        {extra}
      </div>
    </div>
  )
}
