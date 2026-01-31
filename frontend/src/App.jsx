import { useState, useRef, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/chat'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

const suggestions = [
  {
    title: 'Smart Budget',
    description: 'A budget that fits your lifestyle, not the other way around'
  },
  {
    title: 'Analytics',
    description: 'Analytics empowers individuals and businesses to make smarter'
  },
  {
    title: 'Spending',
    description: 'Spending is the way individuals and businesses use their financial'
  }
]

function TypewriterText({ text, speed = 20, onComplete }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!text) return

    let index = 0
    setDisplayedText('')
    setIsComplete(false)

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="typing-cursor">|</span>}
    </span>
  )
}

function App() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const sendMessage = async (text = inputText) => {
    if (!text.trim() || isLoading || isTyping) return

    const userMessage = text.trim()
    setInputText('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setIsLoading(false)
      setIsTyping(true)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, isNew: true }])
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
      setMessages(prev => prev.slice(0, -1))
      setIsLoading(false)
    }
  }

  const handleTypingComplete = () => {
    setIsTyping(false)
    setMessages(prev => 
      prev.map((msg, idx) => 
        idx === prev.length - 1 ? { ...msg, isNew: false } : msg
      )
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    sendMessage(`Tell me about ${suggestion.title.toLowerCase()}`)
  }

  const showChat = messages.length > 0

  const handleBack = () => {
    setMessages([])
    setError(null)
    setInputText('')
    setIsTyping(false)
  }

  const isDisabled = isLoading || isTyping

  return (
    <div className="app">
      {showChat && (
        <header className="header">
          <button className="back-btn" onClick={handleBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </button>
        </header>
      )}

      <main className="main">
        {!showChat ? (
          <div className="welcome">
            <div className="orb-container">
              <div className="orb"></div>
              <div className="orb-glow"></div>
            </div>

            <div className="title">
              <h1>
                {getGreeting()}, I am <span className="gradient-text">NurAI</span>.
              </h1>
              <p>Can I help you with anything?</p>
            </div>

            <div className="input-container">
              <div className="input-box">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message AI Chat..."
                  rows={2}
                  disabled={isDisabled}
                />
                <div className="input-actions">
                  <div className="input-actions-right">
                    <button 
                      className={`send-btn ${inputText.trim() && !isDisabled ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                      onClick={() => sendMessage()}
                      disabled={!inputText.trim() || isDisabled}
                    >
                      {isLoading ? (
                        <div className="spinner"></div>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="suggestions">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  className="suggestion-card"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="message-avatar">
                      <div className="mini-orb"></div>
                    </div>
                  )}
                  <div className="message-content">
                    <p>
                      {msg.role === 'assistant' && msg.isNew ? (
                        <TypewriterText 
                          text={msg.content} 
                          speed={15} 
                          onComplete={handleTypingComplete}
                        />
                      ) : (
                        msg.content
                      )}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">
                    <div className="mini-orb"></div>
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="chat-input">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Chat..."
                rows={1}
                disabled={isDisabled}
              />
              <div className="chat-input-actions">
                <button 
                  className={`send-btn ${inputText.trim() && !isDisabled ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                  onClick={() => sendMessage()}
                  disabled={!inputText.trim() || isDisabled}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
