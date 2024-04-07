'use client'
import { Router } from "next/router"
import Script from "next/script"
import { useEffect, useState } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    let [load, setLoad] = useState(true)

    useEffect(() => {
        Router.events.on("routeChangeStart", () => {
            setLoad(false)
            return () => {
                Router.events.off('routeChangeStart', () => {})
            }
        })
        Router.events.on("routeChangeComplete", () => {
            setLoad(true)
            return () => {
                Router.events.off('routeChangeComplete', () => {})
            }
        })
    }, [Router])

  return (<>
{children}
{load ? <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
     crossOrigin="anonymous"></script> : ""}
</>
  )
}
