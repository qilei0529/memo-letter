import { PaperView } from "@/components/paper/paper-view"
import { HelperView } from "@/components/paper/helper-view"
import { FontWidget } from "@/components/font/font-widget"
import Link from "next/link"
import { Icons } from "@/shared/icons"

Link
export default function Home(props: any) {
  return (
    // B69D7E
    <div className="flex flex-col items-center ">
      <div className="h-[40px]"></div>
      <PaperView />
      <div className="fixed right-4 top-4 w-8 h-8 ">
        <div className=" space-y-2">
          <HelperView />
          <Link
            target="_blank"
            href={"//github.com/qilei0529/memo-letter"}
            className="w-8 h-8 bg-white rounded-2xl flex flex-row items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <Icons.github className="relative w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
