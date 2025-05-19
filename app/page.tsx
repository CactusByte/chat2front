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
            <h1 className="text-4xl font-bold text-white mb-2">Zcret Alpha</h1>
            <p className="text-slate-300">Imagine being in a group chat with some of the best traders out there — all sharing what they're watching, what they’re buying, and what’s about to move. No guesswork, no noise. Just real signals, in real time.

When we’re all in the same chat, we’re seeing the same coins at the same time. That kind of coordination can shift the market. It’s not just about catching trends anymore — it’s about creating them, together.</p>
          </header>

          <div className="rounded-lg shadow-2xl overflow-hidden">
            <ChatInterface />
          </div>

          <footer className="mt-8 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} Zcret Alpha.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
