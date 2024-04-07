import Script from "next/script"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (<>
{children}
    <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
     crossOrigin="anonymous" strategy='lazyOnload'></Script>
</>
  )
}
