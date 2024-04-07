import Script from 'next/script';

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {

  return (
        <>
            {children}
            <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
     crossOrigin="anonymous" defer></Script>
        </>
  )
}
