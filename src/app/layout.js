import {Inter} from 'next/font/google'
import './globals.css'
import {theme} from "@/resources/config";
import {CssVarsProvider} from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BRECKS.',
  description: 'BRECKS.',
}

export default function RootLayout({ children }) {
  return (
      <CssVarsProvider theme={theme}>
        <CssBaseline/>
    <html lang="en">
    <head>
      <link rel='icon' href='/favicon.png' />
    </head>
      <body className={inter.className} style={{height: '100svh'}}>
        {children}
      </body>
    </html>
</CssVarsProvider>
  )
}
