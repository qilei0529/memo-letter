
import { useMemo, useState } from "react";
import Image from "next/image";

import LetterCanvas from "@/components/canvas";

import "@/app/globals.css"

export default function MainPage() {

    const [font, setFont] = useState('12')

    const list = ['12', '10', '8']

    const cls = useMemo(() => {
        return `editor p-3 the_font_${font} w-[275px] h-[500px]`
    }, [font])


    const [text, setText] = useState('')

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <div className="relative flex flex-row mb-4">
                {
                    list.map((item) => {
                        const isCur = item === font
                        const cls = `w-8 h-8 flex items-center justify-center cursor-pointer ${isCur ? "bg-gray-500" : "bg-gray-100"} hover:bg-gray-500`
                        return <div
                            onClick={() => {
                                setFont(item)
                            }}
                            key={item}
                            className={cls}>
                            {item}
                        </div>
                    })
                }
            </div>
            <div className="flex flex-row">
                <div id="targetNode">
                    <textarea onChange={(e) => {
                        console.log(e.target.value)
                        setText(e.target.value)
                    }} className={cls} placeholder="写点什么吧" />
                </div>
                <div>
                    <LetterCanvas size={font} text={text} />
                </div>
            </div>

        </main>
    );
}