import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { User, Bot, AlertCircle, Info } from 'lucide-react'

function ChatMessage({ message, onMetadataClick }) {
  const isUser = message.type === 'user'
  const isError = message.isError

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-br from-dark-600 to-dark-700' 
            : isError 
              ? 'bg-gradient-to-br from-red-500/80 to-red-600/80'
              : 'bg-gradient-to-br from-primary-500 to-primary-600 glow'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-5 py-3.5 ${
            isUser 
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-md' 
              : isError
                ? 'glass border border-red-500/20 text-red-200 rounded-tl-md'
                : 'glass rounded-tl-md'
          }`}
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed">{message.content}</p>
          ) : (
            <div className="message-content text-[15px] leading-relaxed text-dark-100">
              <ReactMarkdown>
                {String(message.content)
                  .replace(/^• /gm, '- ')
                  .replace(/\n• /g, '\n- ')}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Message Footer */}
        <div className={`flex items-center gap-3 mt-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          {/* Timestamp */}
          <span className="text-xs text-dark-500">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>

          {/* Metadata Button */}
          {message.metadata && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMetadataClick}
              className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Details</span>
            </motion.button>
          )}

          {/* Classification Badge */}
          {message.metadata?.classification && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              message.metadata.classification === 'complex' 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {message.metadata.classification}
            </span>
          )}
          {message.metadata?.flagged && (
            <span className="badge warning">
              Needs review
            </span>
          )}
          {message.metadata && !message.metadata.flagged && (
            <span className="badge success">
              Verified answer
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
