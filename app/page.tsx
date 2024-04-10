import { PaperView } from "@/components/paper/paper-view"
import { HelperView } from "@/components/paper/helper-view"

export default function Home(props: any) {
  return (
    // B69D7E
    <div className="flex flex-col items-center ">
      <div className="h-[40px]"></div>
      <PaperView />
      <div className="fixed right-4 top-4 w-8 h-8 ">
        <HelperView />
      </div>
    </div>
  )
}
