'use client'
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    let [load, setLoad] = useState(false)
    useEffect(() => {
        setTimeout(() => setLoad(true), 3000)
    }, [])

  return (<>
  {children}
    {load ? <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
     crossOrigin="anonymous"></script> : ""}
    </>
  )
}
