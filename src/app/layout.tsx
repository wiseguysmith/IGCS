import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
const serif = Cormorant_Garamond({weight:['400','500','600'],subsets:['latin'],variable:'--font-serif'});
const sans = Inter({subsets:['latin'],variable:'--font-sans'});
export const metadata: Metadata = {title:'Investor Golf Capital Summit | San Antonio',description:'A curated gathering bringing together private capital, financial leaders, golf and the emerging infrastructure shaping the future of finance.',robots:{index:false,follow:false},icons:{icon:'/icon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>}
