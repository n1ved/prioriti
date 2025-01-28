import styles from "./page.module.css";
import { Quicksand } from 'next/font/google'
import PrimaryButton from "@/components/buttons/primaryButton";

const quicksand = Quicksand({
    subsets: ['latin'],
    display: 'swap',
})

export default function Home() {
    return (
      <div className={styles.main}>
        <div className={quicksand.className}>
            <h1>prioriti</h1>
        </div>
        <div className={"flex flex-row space-x-4"}>
            <PrimaryButton text={'Get Started'} isUrl={true} url={'/dashboard'}/>
            <PrimaryButton text={'Github'} isUrl={true} url="https://github.com/n1ved/prioriti"/>
        </div>
      </div>
    );
}
