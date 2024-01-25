'use client'

import { useEffect, useRef, useState } from "react"

export function CardView() {
    const [status, setStatus ] = useState()

    const target = useRef<any>()

    const [text, setText] = useState('hello this is card')

    useEffect(() => {
        const handlerPaste = (event: Event & { clipboardData: any }) => {
            // 阻止默认粘贴行为
            event.preventDefault();
            // 获取粘贴的纯文本内容
            const clipboardData = event.clipboardData || (window as any).clipboardData;
            const pastedText = clipboardData.getData('text/plain');
        }

        const handlerInput = (event: Event) => {
            console.log(event)
            event.preventDefault();
            console.log(target.current)
        }

        if (target.current) {
            const elm = target.current
            elm.addEventListener('paste', handlerPaste);
            elm.addEventListener('input', handlerInput);
        }
        return () => {
            if (target.current) {
                target.current.removeEventListener('paste', handlerPaste)
                target.current.removeEventListener('input', handlerInput)
            }
        }
    }, [])

    return (
        <div className="the_font_10">

            <div className="bg-yellow-100 p-3 leading-4">
                <div ref={target} contentEditable={true}>
                    {text}
                </div>
            </div>
        </div>
    )
}