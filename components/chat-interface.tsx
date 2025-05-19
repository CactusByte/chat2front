"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Send, User, AlertCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MessageList from "@/components/message-list"
import { useWallet } from "@solana/wallet-adapter-react"
import WalletConnectButton from "@/components/wallet-connect-button"
import { io } from "socket.io-client"
import { TooltipProvider } from "@/components/ui/tooltip"

// This will be replaced with your actual backend URL
const SOCKET_URL = "https://chat-sol-84af8fdc9c59.herokuapp.com/"

interface Message {
  id: string
  sender: string
  content: string
  created_at: string
}


export default function ChatInterface() {
  const { connected, publicKey, disconnect } = useWallet()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [socketError, setSocketError] = useState<string | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const socketRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get wallet address from connected wallet
  // Ensure it's in the format expected by the backend (44 chars, base58)
  const walletAddress = publicKey ? publicKey.toString() : ""

  // For testing with the mock wallet if needed
  // const walletAddress = MOCK_WALLET

  const addDebugLog = (message: string) => {
    setDebugLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]} - ${message}`])
  }

  useEffect(() => {
    // Only connect to socket if wallet is connected
    if (!connected || !walletAddress) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
      return
    }

    addDebugLog(`Attempting to connect...}`)

    try {
      // Initialize socket connection with explicit configuration
      socketRef.current = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        transports: ["websocket", "polling"],
      })

      // Handle connection events
      socketRef.current.on("connect", () => {
        setIsConnected(true)
        setSocketError(null)
        addDebugLog(`Socket connected`)

        // Login with wallet
        addDebugLog(`Emitting login with wallet: ${walletAddress}`)
        socketRef.current.emit("login", { wallet: walletAddress })

        // Fetch messages
        addDebugLog("Requesting messages")
        socketRef.current.emit("fetch_messages")
      })

      socketRef.current.on("connect_error", (err: Error) => {
        setSocketError(`Connection error: ${err.message}`)
        setIsConnected(false)
        addDebugLog(`Socket connection error: ${err.message}`)
      })

      socketRef.current.on("disconnect", (reason: string) => {
        setIsConnected(false)
        addDebugLog(`Socket disconnected: ${reason}`)
      })

      // Handle messages
      socketRef.current.on("messages", (data: Message[]) => {
        addDebugLog(`Received ${data.length} messages`)

        // Ensure each message has an id
        const messagesWithIds = data.map((msg, index) => ({
          ...msg,
          id: msg.id || `server-msg-${index}`,
        }))

        // Sort messages by created_at in ascending order (oldest first)
        const sortedMessages = [...messagesWithIds].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )

        setMessages(sortedMessages)
        setIsLoading(false)

        // Scroll to bottom after messages load
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      })

      socketRef.current.on("new_message", (msg: Message) => {
        addDebugLog(`Received new message from ${msg.sender.slice(0, 6)}...`)

        // Ensure the message has an id
        const messageWithId = {
          ...msg,
          id: msg.id || `new-msg-${Date.now()}`,
        }

        // Add new message to the end of the array (newest at bottom)
        setMessages((prev) => [...prev, messageWithId])

        // Scroll to bottom for new messages
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      })

      // Handle login success
      socketRef.current.on("login_success", (data: any) => {
        addDebugLog(`Login successful for wallet: ${data.wallet}`)
      })

      // Error handling
      socketRef.current.on("error", (error: any) => {
        setSocketError(`Server error: ${error.message || JSON.stringify(error)}`)
        addDebugLog(`Socket error: ${JSON.stringify(error)}`)
      })

      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          addDebugLog("Disconnecting socket")
          socketRef.current.disconnect()
        }
      }
    } catch (err: any) {
      setSocketError(`Failed to initialize socket: ${err.message}`)
      addDebugLog(`Socket initialization error: ${err.message}`)
    }
  }, [connected, walletAddress])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !walletAddress) return

    addDebugLog(`Sending message: ${input.slice(0, 20)}${input.length > 20 ? "..." : ""}`)

    // Send message
    socketRef.current.emit("send_message", { wallet: walletAddress, content: input })

    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  // If wallet is not connected, show connect button
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-800 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800">Zcret Alpha</h2>
          </div>
          <p className="text-gray-600">Connect your Solana wallet to join the conversation</p>
          <p className="text-gray-600">(No need to have funds in your wallet)</p>
        </div>
        <div>
          <WalletConnectButton />
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[600px] relative overflow-hidden bg-white rounded-lg">
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <div className="text-gray-800 font-medium">
                {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
              </div>
              <div className="text-xs text-gray-500">Solana Wallet</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={isConnected ? "success" : "destructive"}
              className={`${isConnected ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"} border`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </div>
        </div>

        {/* Socket Error Alert */}
        {socketError && (
          <Alert variant="destructive" className="m-2 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">{socketError}</AlertDescription>
          </Alert>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-200" />
                    <Skeleton className="h-4 w-[200px] bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <MessageList messages={messages} currentWallet={walletAddress} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Debug Logs (Toggle with button) */}
        <div className="border-t border-gray-200 bg-gray-50 p-2">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-gray-600">Debug Logs</summary>
            <div className="mt-2 max-h-32 overflow-y-auto bg-gray-800 text-gray-200 p-2 rounded">
              {debugLogs.map((log, i) => (
                <div key={i} className="font-mono">
                  {log}
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500"
              disabled={!isConnected}
            />
            <Button
              onClick={sendMessage}
              disabled={!isConnected || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
