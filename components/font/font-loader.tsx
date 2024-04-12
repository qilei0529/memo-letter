"use client"
import React, { useState } from "react"
import axios from "axios"

import { createGlobalStyle } from "styled-components"
export const GlobalFont = createGlobalStyle`
  @font-face {
    font-family: 'JYY';
    src: url('https://ffas.sjtype.com/fonts/%E4%BB%8A%E5%B9%B4%E4%B9%9F%E8%A6%81%E5%8A%A0%E6%B2%B9%E9%B8%AD.ttf') format('woff');
  }
`

export const FontLoader = ({ src }: { src: string }) => {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")

  const fetchFile = async () => {
    console.log(333, src)
    const url = src
    const response = await axios.get(url, {
      // headers: {
      //   "Content-Type": "application/json",
      // },
      onDownloadProgress: (progressEvent: any) => {
        console.log(111, progressEvent)
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 7427360)
        )
        console.log(percentCompleted)
        setProgress(percentCompleted)
      },
    })
    // 处理下载完成后的文件
    // const file = new Blob([response.data])
    // Do something with the file...
    console.log(4444)
    setStatus("READY")
  }
  return (
    <div>
      <button onClick={fetchFile}>Load File</button>
      <p>Progress: {progress}%</p>
      {status === "READY" ? <GlobalFont /> : null}
    </div>
  )
}
