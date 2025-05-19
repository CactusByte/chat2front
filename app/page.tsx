import ChatInterface from "@/components/chat-interface"
import BackgroundShapes from "@/components/background-shapes"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background shapes */}
      <BackgroundShapes />

      {/* Static background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Solana Chat</h1>
            <p className="text-slate-300">Real-time messaging on the Solana blockchain</p>
          </header>

          <div className="rounded-lg shadow-2xl overflow-hidden">
            <ChatInterface />
          </div>

          <footer className="mt-8 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} Solana Chat. Powered by Solana & Socket.IO</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
