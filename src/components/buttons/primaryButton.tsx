'use client'
import {Quicksand} from 'next/font/google'

const quicksand = Quicksand({
    subsets: ['latin'],
    display: 'swap',
})

interface PrimaryButtonProps {
    text: string,
    isUrl?: boolean,
    url?: string,
    onClick?: () => void,
}

export default function PrimaryButton({text,isUrl=false,url,onClick}: PrimaryButtonProps) {

    const handleUrlRedirect = () => {
        if (typeof url === "string" && typeof window !== "undefined") {
            window.location.href = url;
        }
    }

    return (
        <div className={quicksand.className}>
            <button onClick={isUrl ? handleUrlRedirect :onClick} className={`text-white font-bold py-2 px-4 rounded border-2 border-white hover:bg-white hover:text-black transition duration-300 ease-in-out bg-blend-screen`}>
                {text}
            </button>
        </div>
    )
}