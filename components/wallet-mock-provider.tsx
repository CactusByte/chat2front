"use client"

import { type FC, type ReactNode, useMemo, useState } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import { Button } from "@/components/ui/button"

// Import the styles
import "@solana/wallet-adapter-react-ui/styles.css"

// Mock wallet adapter for testing with backend
class MockWalletAdapter extends PhantomWalletAdapter {
  constructor() {
    super()
    this.name = "Mock Wallet"
    this.icon =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM4MjQ3RTUiLz48L3N2Zz4="
  }

  get publicKey() {
    // Return a valid 44-character base58 string that matches backend validation
    return {
      toString: () => "11111111111111111111111111111111111111111111",
    }
  }

  async connect() {
    this._connected = true
    this.emit("connect")
  }

  async disconnect() {
    this._connected = false
    this.emit("disconnect")
  }
}

interface WalletContextProviderProps {
  children: ReactNode
  useMockWallet?: boolean
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children, useMockWallet = false }) => {
  const [mockEnabled, setMockEnabled] = useState(useMockWallet)

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  const wallets = useMemo(() => {
    if (mockEnabled) {
      return [new MockWalletAdapter()]
    }
    return [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
  }, [network, mockEnabled])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
