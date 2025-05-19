"use client"

import type React from "react"

import { useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import { MessageSquare, Copy, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  id: string
  sender: string
  content: string
  created_at: string
}

interface MessageListProps {
  messages: Message[]
  currentWallet: string
}

export default function MessageList({ messages, currentWallet }: MessageListProps) {
  const [expandedWallets, setExpandedWallets] = useState<Record<string, boolean>>({})
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null)

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-center">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  const toggleWalletExpand = (messageId: string) => {
    setExpandedWallets((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  const copyToClipboard = (e: React.MouseEvent, wallet: string) => {
    e.stopPropagation() // Prevent triggering the parent click handler
    navigator.clipboard.writeText(wallet)
    setCopiedWallet(wallet)
    setTimeout(() => setCopiedWallet(null), 2000)
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      // First try to parse as ISO string
      const date = parseISO(timestamp)

      // Check if the date is valid
      if (!isValid(date)) {
        throw new Error("Invalid date")
      }

      // If the date is today, show time only
      const now = new Date()
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()

      if (isToday) {
        return format(date, "h:mm a") // e.g. "3:42 PM"
      }

      // If within the last week, show day and time
      const oneWeekAgo = new Date(now)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      if (date > oneWeekAgo) {
        return format(date, "EEE 'at' h:mm a") // e.g. "Mon at 3:42 PM"
      }

      // Otherwise show date
      return format(date, "MMM d, yyyy 'at' h:mm a") // e.g. "Jan 5, 2023 at 3:42 PM"
    } catch (error) {
      console.error("Error formatting date:", error, timestamp)
      return "Unknown time"
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, i) => {
        const isCurrentUser = msg.sender === currentWallet
        const messageId = msg.id || `msg-${i}`
        const isExpanded = expandedWallets[messageId]
        const formattedTime = msg.created_at ? formatTimestamp(msg.created_at) : "Just now"

        return (
          <div key={messageId} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {!isCurrentUser && (
                <div
                  className="flex items-center mb-1 cursor-pointer group"
                  onClick={() => toggleWalletExpand(messageId)}
                >
                  <div className="font-semibold text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                    {isExpanded ? msg.sender : `${msg.sender.slice(0, 6)}...${msg.sender.slice(-4)}`}
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => copyToClipboard(e, msg.sender)}
                        >
                          {copiedWallet === msg.sender ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">{copiedWallet === msg.sender ? "Copied!" : "Copy wallet address"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <div className="break-words">{msg.content}</div>
              <div className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>{formattedTime}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
