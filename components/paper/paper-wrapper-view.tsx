import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function PapeWapperView({
  children,
  isMobile,
  font,
}: {
  isMobile: boolean
  font: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative sm:w-[640px] bg-red-100 mb-20",
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
            isMobile ? "left-[0px] top-[32px]" : "left-[160px] top-[40px]",
            "flex flex-col w-[420px] text-[#31271C] text-[20px] leading-[30px]"
          )}
          // onMouseLeave={() => setHoverSection(-1)}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
