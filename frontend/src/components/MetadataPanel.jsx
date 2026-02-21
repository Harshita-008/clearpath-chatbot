import { motion } from 'framer-motion'
import { X, Cpu, Clock, Tag, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react'

function MetadataPanel({ metadata, onClose }) {
  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-80 glass border-l border-white/5 p-5 overflow-y-auto flex-shrink-0 hidden lg:block"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-dark-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-400" />
          Response Details
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-dark-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Model Info */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-dark-400" />
          <span className="text-xs text-dark-400 uppercase tracking-wider font-medium">Model Used</span>
        </div>
        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
          <p className="font-mono text-sm text-primary-400 font-medium">{metadata.model}</p>
          <p className="text-xs text-dark-400 mt-1">
            {metadata.model?.includes('70b') ? 'High-capacity model for complex queries' : 'Fast model for simple queries'}
          </p>
        </div>
      </motion.div>

      {/* Classification */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-dark-400" />
          <span className="text-xs text-dark-400 uppercase tracking-wider font-medium">Query Classification</span>
        </div>
        <div className={`rounded-xl p-4 border ${
          metadata.classification === 'complex'
            ? 'bg-purple-500/10 border-purple-500/20'
            : 'bg-blue-500/10 border-blue-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              metadata.classification === 'complex' ? 'bg-purple-400' : 'bg-blue-400'
            }`}></span>
            <span className={`font-medium capitalize ${
              metadata.classification === 'complex' ? 'text-purple-300' : 'text-blue-300'
            }`}>
              {metadata.classification}
            </span>
          </div>
          <p className="text-xs text-dark-400 mt-2">
            {metadata.classification === 'complex' 
              ? 'Routed to advanced model due to query complexity' 
              : 'Handled by fast model for quick response'}
          </p>
        </div>
      </motion.div>

      {/* Latency */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-dark-400" />
          <span className="text-xs text-dark-400 uppercase tracking-wider font-medium">Response Time</span>
        </div>
        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold text-dark-100">{metadata.latency}</span>
            <span className="text-sm text-dark-400">ms</span>
          </div>
          <div className="mt-2 h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(metadata.latency / 50, 100)}%` }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`h-full rounded-full ${
                metadata.latency < 1000 
                  ? 'bg-primary-500' 
                  : metadata.latency < 3000 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
            />
          </div>
          <p className="text-xs text-dark-400 mt-2">
            {metadata.latency < 1000 
              ? 'Excellent response time' 
              : metadata.latency < 3000 
                ? 'Normal response time' 
                : 'Slower than usual'}
          </p>
        </div>
      </motion.div>

      {/* Quality Check */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-2 mb-2">
          {metadata.flagged ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle className="w-4 h-4 text-dark-400" />
          )}
          <span className="text-xs text-dark-400 uppercase tracking-wider font-medium">Quality Check</span>
        </div>
        <div className={`rounded-xl p-4 border ${
          metadata.flagged 
            ? 'bg-amber-500/10 border-amber-500/20' 
            : 'bg-primary-500/10 border-primary-500/20'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            {metadata.reasons?.refusal && <span className="badge">Verify with support</span>}
            {metadata.flagged && (
              <span className="badge warning">
                Needs review
              </span>
            )}
            {!metadata.flagged && (
              <span className="badge success">
                Verified answer
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-dark-700/50">
        <p className="text-xs text-dark-500 text-center">
          Using RAG with semantic search
        </p>
      </div>
    </motion.aside>
  )
}

export default MetadataPanel
