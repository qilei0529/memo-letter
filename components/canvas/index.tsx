import React, { useEffect, useMemo, useRef, useState } from "react"


import "./style.css"

export default function LetterCanvas(props: { text: string, size: string }) {
    const [status, setStatus] = useState()
    const target = useRef<any>()
    useEffect(() => {
        const canvas = target.current;

        const MAP: { [key: string]: string} = {
            '12': '36px',
            '10': '30px',
            '8': '24px',
        }
        const nodeToCapture: any = document.getElementById('targetNode');
        const ctx = canvas.getContext('2d');
        // 填充实心文本
        ctx.clearRect(0,0, 750, 1000)
        ctx.fillStyle = 'white';
        // 绘制矩形
        ctx.fillRect(0, 0, 750, 1000);
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.font = `${MAP[props.size]} Pixel${props.size}`; // 设置字体大小和字体样式
        ctx.fillStyle = 'black'; // 设置字体颜色
        ctx.textAlign = 'left'; // 设置文本水平对齐方式
        // ctx.textBaseline = 'middle'; // 设置文本垂直对齐方式

        const textList = (props.text || '').split("\n")
        if (textList.length > 0) {
            console.log(3333, textList)
            textList.map((text, i) => {
                ctx.fillText(text || '', 32, 50 + i * 50);
            })

        } else {
            ctx.fillText(props.text || 'Hello, World!', 32, 50);
        }


        // 定义锐化矩阵
        const matrix = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
          ];
        const imageData = ctx.getImageData(0, 0, canvas.width, 50);
        const data = imageData.data;
        // const filteredData: ImageDataSettings = applyConvolutionFilter(data, imageData.width, imageData.height, matrix);
        // 将处理后的数据绘制回 canvas
        // const filteredImageData = new ImageData(filteredData, imageData.width, imageData.height);
        // ctx.putImageData(filteredImageData, 0, 0);
    }, [props.text, props.size]);

    
    //  className1="w-[375px] h-[500px]"
    return useMemo(() => {
        return (
            <div className="canvas">
                {status}
                <canvas width="750" height="1000" className="w-[375px] h-[500px]" ref={target} id={"letter-canvas"} />
            </div>
        )
    }, [])
}

// 应用卷积滤镜
function applyConvolutionFilter(data: any, width: number, height: number, matrix: any) {
    const result = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = applyMatrix(data, i, matrix, width, height, 'r');
        const g = applyMatrix(data, i, matrix, width, height, 'g');
        const b = applyMatrix(data, i, matrix, width, height, 'b');
        result[i] = r;
        result[i + 1] = g;
        result[i + 2] = b;
        result[i + 3] = data[i + 3];
      }
    }
    return result;
  }
  // 应用矩阵滤镜
  function applyMatrix(data: any, i: number, matrix: any, width: number, height: number, channel: string) {
    let sum = 0;
    for (let k = 0; k < 9; k++) {
      const rowIndex = Math.floor(k / 3);
      const colIndex = k % 3;
      const neighborIndex = ((i / 4) % width + (colIndex - 1) + width * (rowIndex - 1)) * 4;
      sum += data[neighborIndex + (channel === 'r' ? 0 : channel === 'g' ? 1 : 2)] * matrix[k];
    }
    return Math.min(Math.max(sum, 0), 255);
  }