import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import WelcomeScreen from './components/WelcomeScreen'
import MetadataPanel from './components/MetadataPanel'

const isDev = import.meta.env.DEV
const API_BASE = isDev ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')
const API_PREFIX = isDev ? '/api' : ''

async function fetchWithRetry(url, retries = 2) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (err) {
    if (retries > 0) return fetchWithRetry(url, retries - 1);
    throw err;
  }
}

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentMetadata, setCurrentMetadata] = useState(null)
  const [showMetadata, setShowMetadata] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const data = await fetchWithRetry(`${API_BASE}${API_PREFIX}/chat?q=${encodeURIComponent(text)}&session=demo`)

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        metadata: {
          model: data.model_used,
          classification: data.classification,
          latency: data.latency_ms,
          flagged: data.flagged,
          reasons: data.reasons
        }
      }

      setMessages(prev => [...prev, aiMessage])
      setCurrentMetadata(aiMessage.metadata)
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, I encountered an error connecting to the server. Please make sure the backend is running on port 5000.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion)
  }

  const clearChat = () => {
    setMessages([])
    setCurrentMetadata(null)
  }

  return (
    <div className="min-h-screen gradient-bg dot-pattern flex flex-col">
      <Header 
        onClearChat={clearChat} 
        hasMessages={messages.length > 0}
        showMetadata={showMetadata}
        onToggleMetadata={() => setShowMetadata(!showMetadata)}
        currentMetadata={currentMetadata}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onMetadataClick={() => {
                        if (message.metadata) {
                          setCurrentMetadata(message.metadata)
                          setShowMetadata(true)
                        }
                      }}
                    />
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="glass rounded-2xl rounded-tl-md px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                          <span className="text-dark-400 text-sm ml-2">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 pb-6">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        </main>

        {/* Metadata Sidebar */}
        <AnimatePresence>
          {showMetadata && currentMetadata && (
            <MetadataPanel
              metadata={currentMetadata}
              onClose={() => setShowMetadata(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
