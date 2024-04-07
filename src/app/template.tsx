'use client';
import './globals.css'
import '@radix-ui/themes/styles.css';

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {

  return (
        <>
            {children}
            <script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
     crossOrigin="anonymous" defer></script>
        </>
  )
}
