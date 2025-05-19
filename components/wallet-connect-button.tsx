"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function WalletConnectButton() {
  const { connected } = useWallet()

  return (
    <div className="wallet-connect-container">
      {/* Custom styling for the wallet adapter UI */}
      <style jsx global>{`
        .wallet-adapter-button {
          background-color: #3b82f6 !important;
          border-radius: 0.5rem !important;
          height: 2.75rem !important;
          color: white !important;
          font-family: inherit !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          padding: 0 1.25rem !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .wallet-adapter-button:hover {
          background-color: #2563eb !important;
          transform: translateY(-1px) !important;
        }
        .wallet-adapter-modal-wrapper {
          background-color: white !important;
          border: 1px solid #e5e7eb !important;
          color: #1f2937 !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .wallet-adapter-modal-button-close {
          background-color: #f3f4f6 !important;
          color: #1f2937 !important;
        }
        .wallet-adapter-modal-title {
          color: #1f2937 !important;
        }
        .wallet-adapter-modal-content {
          color: #4b5563 !important;
        }
        .wallet-adapter-modal-list .wallet-adapter-button {
          background-color: #f3f4f6 !important;
          color: #1f2937 !important;
        }
        .wallet-adapter-modal-list .wallet-adapter-button:hover {
          background-color: #e5e7eb !important;
        }
      `}</style>

      <WalletMultiButton />
    </div>
  )
}
