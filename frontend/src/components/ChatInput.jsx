import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'

function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }, [input])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <motion.form
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="glass rounded-2xl p-2 glow-strong border border-dark-700/50 hover:border-primary-500/30 transition-colors">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about ClearPath documentation..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-dark-100 placeholder:text-dark-500 resize-none px-4 py-3 focus:outline-none text-[15px] leading-relaxed max-h-36 scrollbar-thin"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
                : 'bg-dark-700 text-dark-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between mt-2 px-2">
        <p className="text-xs text-dark-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-dark-400 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-dark-400 font-mono text-[10px]">Shift+Enter</kbd> for new line
        </p>
        <p className="text-xs text-dark-500">
          Powered by RAG
        </p>
      </div>
    </motion.form>
  )
}

export default ChatInput
