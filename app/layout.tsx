import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletContextProvider } from "@/components/wallet-mock-provider"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zcret Alpha",
  description: "Find real-time trending coins by being connected in chat with the best traders in the world. By being in the same chat we can see the same coins and control the market.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <WalletContextProvider useMockWallet={true}>{children}</WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
