import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Icons } from "@/shared/icons"

const HELP_LIST = [
  {
    title: "输入",
    tag: "cmd + Enter",
  },
  {
    title: "删除",
    tag: "Del",
  },
  {
    title: "上一行",
    tag: "k",
  },
  {
    title: "下一行",
    tag: "j",
  },
  {
    title: "编辑",
    tag: "i",
  },
  {
    title: "退出编辑",
    tag: "Esc",
  },
]

export function HelperView() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-8 h-8 bg-white rounded-2xl flex flex-row items-center justify-center text-slate-400 hover:text-slate-600">
          <Icons.question className="relative w-5 h-5 top-[-1px] right-[-1px]" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="shadow-2xl p-0 mt-[10px] mr-[16px] border-slate-200 bg-slate-50 rounded-lg w-[160px]"
      >
        <div className="p-2 space-y-1 text-slate-600">
          {HELP_LIST.map((item, key) => {
            return (
              <div
                key={key}
                className=" flex flex-row space-x-2 px-2 hover:bg-slate-200"
              >
                <div className="text-[14px] flex-1">{item.title}</div>
                <div className="text-[12px]">{item.tag}</div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
