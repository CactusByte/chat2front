import DebugTools from "@/components/debug-tools"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Socket.IO Debug Tools</h1>
            <p className="text-purple-200">Test your Socket.IO server connection and events</p>
          </header>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-6">
            <DebugTools />
          </div>

          <footer className="mt-8 text-center text-purple-200 text-sm">
            <p>© {new Date().getFullYear()} Solana Chat. Powered by Socket.IO</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
