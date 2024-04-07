'use client'
import { Router } from "next/router"
import Script from "next/script"
import { useEffect } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    useEffect(() => {
        let script = document.createElement("script")
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
        script.async = true
        script.crossOrigin = "anonymous"

        document.body.appendChild(script)

        Router.events.on("routeChangeComplete", () => {
            document.body.removeChild(script)
            return () => {
                Router.events.off('routeChangeComplete', () => {})
            }
        })
    }, [Router])

  return (<>
{children}
</>
  )
}
