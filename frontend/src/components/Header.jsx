import { motion } from 'framer-motion'
import { Trash2, Info, Sparkles, Zap } from 'lucide-react'

function Header({ onClearChat, hasMessages, showMetadata, onToggleMetadata, currentMetadata }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass border-b border-white/5 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center glow"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <div>
              <h1 className="font-display font-semibold text-lg tracking-tight">
                <span className="gradient-text">ClearPath</span>
              </h1>
              <p className="text-xs text-dark-400 -mt-0.5">AI Support Assistant</p>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/50 border border-dark-700/50">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-dark-300">Connected</span>
            </div>

            {/* Model Badge */}
            {currentMetadata && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-primary-300 font-medium">
                  {currentMetadata.model?.split('-').slice(0, 2).join('-')}
                </span>
              </motion.div>
            )}

            {/* Latency Badge */}
            {currentMetadata?.latency && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800/50 border border-dark-700/50"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs text-dark-300">{currentMetadata.latency}ms</span>
              </motion.div>
            )}

            {/* Info Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleMetadata}
              className={`p-2 rounded-lg transition-colors ${
                showMetadata 
                  ? 'bg-primary-500/20 text-primary-400' 
                  : 'hover:bg-dark-700/50 text-dark-400 hover:text-dark-200'
              }`}
              title="Toggle response details"
            >
              <Info className="w-5 h-5" />
            </motion.button>

            {/* Clear Chat */}
            {hasMessages && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearChat}
                className="p-2 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
