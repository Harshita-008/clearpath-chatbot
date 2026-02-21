import { motion } from 'framer-motion'
import { MessageSquare, Zap, Shield, BookOpen, HelpCircle, Settings, Users, CreditCard } from 'lucide-react'

const suggestions = [
  {
    icon: HelpCircle,
    text: "How do I get started with ClearPath?",
    category: "Getting Started"
  },
  {
    icon: Settings,
    text: "How do I configure my workspace settings?",
    category: "Configuration"
  },
  {
    icon: Users,
    text: "How can I invite team members?",
    category: "Team Management"
  },
  {
    icon: CreditCard,
    text: "What are the pricing plans available?",
    category: "Billing"
  }
]

const features = [
  {
    icon: Zap,
    title: "Instant Answers",
    description: "Get quick responses powered by advanced AI"
  },
  {
    icon: BookOpen,
    title: "Documentation-Based",
    description: "Answers sourced from official ClearPath docs"
  },
  {
    icon: Shield,
    title: "Smart Routing",
    description: "Complex queries use more powerful models"
  }
]

function WelcomeScreen({ onSuggestionClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[60vh] py-8"
    >
      {/* Logo Animation */}
      <motion.div
        variants={itemVariants}
        className="relative mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center glow-strong"
        >
          <MessageSquare className="w-10 h-10 text-white" />
        </motion.div>
        
        {/* Decorative rings */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border-2 border-primary-500/30"
          />
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-2xl border-2 border-primary-500/20"
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={itemVariants}
        className="text-3xl md:text-4xl font-display font-bold text-center mb-3"
      >
        Welcome to <span className="gradient-text">ClearPath</span>
      </motion.h2>
      
      <motion.p
        variants={itemVariants}
        className="text-dark-400 text-center max-w-md mb-10 text-lg"
      >
        Your AI-powered support assistant. Ask me anything about ClearPath!
      </motion.p>

      {/* Features */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-10"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass rounded-xl p-4 border border-dark-700/50 hover:border-primary-500/30 transition-colors"
          >
            <feature.icon className="w-5 h-5 text-primary-400 mb-2" />
            <h3 className="font-medium text-sm text-dark-100 mb-1">{feature.title}</h3>
            <p className="text-xs text-dark-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Suggestions */}
      <motion.div variants={itemVariants} className="w-full max-w-2xl">
        <p className="text-sm text-dark-400 mb-4 text-center">Try asking:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="flex items-start gap-3 p-4 glass rounded-xl border border-dark-700/50 hover:border-primary-500/30 text-left group transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                <suggestion.icon className="w-4 h-4 text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-primary-400/80 font-medium">{suggestion.category}</span>
                <p className="text-sm text-dark-200 mt-0.5 leading-snug">{suggestion.text}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WelcomeScreen
