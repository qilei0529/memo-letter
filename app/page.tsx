import Image from "next/image";
import { CardView } from "@/components/card";

export default function Home(props: any) {

    return (
        <main className="flex min-h-screen flex-col items-center pt-24 sm:p-24">
            <span className="the_font_10">A tool for writing letter in pixel.</span>
            <CardView />
        </main>
    );
}
