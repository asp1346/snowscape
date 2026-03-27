import './globals.css'

export const metadata = {
  title: 'Snowscape',
  description: 'Live ski resort conditions for the Pacific Northwest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}