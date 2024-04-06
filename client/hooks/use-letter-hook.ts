import { useMemo } from "react"
import { useLetterStore } from "../stores/letter-store"

export const useLetterHook = ({ id }: { id: string }) => {
  const getLetter = useLetterStore((state) => state.getLetter)
  const letter = useMemo(() => {
    return getLetter(id)
  }, [id])

  return {
    letter,
  }
}
