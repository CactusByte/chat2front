"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { io } from "socket.io-client"

export default function DebugTools() {
  const [serverUrl, setServerUrl] = useState("http://localhost:8000")
  const [socketStatus, setSocketStatus] = useState("Disconnected")
  const [socketId, setSocketId] = useState("")
  const [testWallet, setTestWallet] = useState("TestWallet123")
  const [testMessage, setTestMessage] = useState("Hello, this is a test message!")
  const [logs, setLogs] = useState<string[]>([])
  const [socket, setSocket] = useState<any>(null)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]} - ${message}`])
  }

  const connectSocket = () => {
    try {
      addLog(`Attempting to connect to ${serverUrl}`)
      const newSocket = io(serverUrl, {
        reconnectionAttempts: 3,
        timeout: 10000,
      })

      newSocket.on("connect", () => {
        setSocketStatus("Connected")
        setSocketId(newSocket.id)
        addLog(`Connected with socket ID: ${newSocket.id}`)
      })

      newSocket.on("connect_error", (err) => {
        setSocketStatus(`Error: ${err.message}`)
        addLog(`Connection error: ${err.message}`)
      })

      newSocket.on("disconnect", (reason) => {
        setSocketStatus(`Disconnected: ${reason}`)
        addLog(`Disconnected: ${reason}`)
      })

      newSocket.on("error", (error) => {
        addLog(`Socket error: ${JSON.stringify(error)}`)
      })

      // Listen for messages
      newSocket.on("messages", (data) => {
        addLog(`Received messages: ${JSON.stringify(data)}`)
      })

      newSocket.on("new_message", (msg) => {
        addLog(`Received new message: ${JSON.stringify(msg)}`)
      })

      setSocket(newSocket)
    } catch (err: any) {
      setSocketStatus(`Failed: ${err.message}`)
      addLog(`Failed to initialize socket: ${err.message}`)
    }
  }

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setSocketStatus("Disconnected")
      addLog("Socket manually disconnected")
    }
  }

  const sendLogin = () => {
    if (!socket) {
      addLog("Socket not connected")
      return
    }

    addLog(`Sending login with wallet: ${testWallet}`)
    socket.emit("login", { wallet: testWallet }, (response: any) => {
      addLog(`Login response: ${JSON.stringify(response)}`)
    })
  }

  const fetchMessages = () => {
    if (!socket) {
      addLog("Socket not connected")
      return
    }

    addLog("Requesting messages")
    socket.emit("fetch_messages", (response: any) => {
      addLog(`Fetch messages response: ${JSON.stringify(response)}`)
    })
  }

  const sendTestMessage = () => {
    if (!socket) {
      addLog("Socket not connected")
      return
    }

    addLog(`Sending test message: ${testMessage}`)
    socket.emit("send_message", { wallet: testWallet, content: testMessage }, (response: any) => {
      addLog(`Send message response: ${JSON.stringify(response)}`)
    })
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Socket.IO Debug Tools</CardTitle>
        <CardDescription>Test your Socket.IO server connection and events</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connection">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4 mt-4">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="Socket.IO server URL"
              />
              {!socket ? (
                <Button onClick={connectSocket}>Connect</Button>
              ) : (
                <Button onClick={disconnectSocket} variant="destructive">
                  Disconnect
                </Button>
              )}
            </div>
            <div className="text-sm">
              <div>
                <strong>Status:</strong> {socketStatus}
              </div>
              {socketId && (
                <div>
                  <strong>Socket ID:</strong> {socketId}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  value={testWallet}
                  onChange={(e) => setTestWallet(e.target.value)}
                  placeholder="Test wallet address"
                />
                <Button onClick={sendLogin} disabled={!socket}>
                  Login
                </Button>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Test message"
                />
                <Button onClick={sendTestMessage} disabled={!socket}>
                  Send
                </Button>
              </div>

              <Button onClick={fetchMessages} disabled={!socket} className="w-full">
                Fetch Messages
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <div className="bg-gray-800 text-gray-200 p-3 rounded h-[300px] overflow-y-auto font-mono text-xs">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className="pb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No logs yet</div>
              )}
            </div>
            <Button onClick={clearLogs} variant="outline" className="mt-2">
              Clear Logs
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
