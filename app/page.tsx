import BoardView from "@/components/board"
import { PaperView } from "@/components/paper"

export default function Home(props: any) {
  return (
    // B69D7E
    <div className="flex flex-col items-center ">
      <div className="h-[40px]"></div>
      <PaperView />
    </div>
  )
}
