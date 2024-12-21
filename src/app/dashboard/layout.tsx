'use client';
import {createContext, useState} from 'react'
import {set} from "zod";

// @ts-ignore
export const SharedDataContext = createContext()

// @ts-ignore
export default function RootLayout({ children }) {

    const [curDate , setCurDate] = useState(new Date());
    const [count , setCount] = useState(0);
    const [totalCount , setTotalCount] = useState(1);
    const sharedData = {
        curDate : curDate,
        setCurDate : setCurDate,
        count : count,
        setCount : setCount,
        totalCount : totalCount,
        setTotalCount : setTotalCount
    }

    return (
        <SharedDataContext.Provider value={sharedData}>
            <div>
                {children}
            </div>
        </SharedDataContext.Provider>
    )
}
