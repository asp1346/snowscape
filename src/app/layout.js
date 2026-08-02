import { Space_Grotesk, Manrope } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

export const metadata = {
  title: 'Snowscape',
  description: 'Live ski resort conditions for the Pacific Northwest',
}

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('snowscape-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${manrope.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
