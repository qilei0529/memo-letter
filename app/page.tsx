
import Image from "next/image";



export default function Home(props: any) {

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="relative flex flex-row">
        <div className="w-8 h-8 flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-500">12</div>
        <div className="ml-2 w-8 h-8 flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-500">10</div>
      </div>
      <textarea className="editor the_font_10 w-[600px] h-[600px]" placeholder="写点什么吧">
      </textarea>
    </main>
  );
}
