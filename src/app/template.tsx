'use client';
import './globals.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import Nav from '@/components/Nav';
import { getServerSession } from 'next-auth';
import jwt from "jsonwebtoken"
import { headers } from 'next/headers';
import Script from 'next/script';

export default async function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {

  return (
        <>
            {children}
            <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
     crossOrigin="anonymous" defer async></Script>
        </>
  )
}
