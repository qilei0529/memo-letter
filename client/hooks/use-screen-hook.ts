import { useEffect, useState } from "react"

export const useScreenHook = () => {
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

  return {
    isMobile,
  }
}
