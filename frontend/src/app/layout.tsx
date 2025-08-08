import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Kvízy pro malé objevitele',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='cs'>
      <body
        className={`${rubik.className} max-w-xl grid justify-items-center mx-auto p-6`}
      >
        {children}
      </body>
    </html>
  )
}
