import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { Robot, Person, Send, Trash } from 'react-bootstrap-icons';

function HealthBotPage({ user }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Health Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const HEALTHBOT_API_BASE_URL = import.meta.env.VITE_HEALTHBOT_API_BASE_URL || "http://localhost:8000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${HEALTHBOT_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_input: userMessage,
          session_id: sessionId,
          user_id: user?.gmail || 'anonymous'
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message || data.response || 'I apologize, but I could not understand that. Could you please rephrase?'
      }]);

      if (data.followup) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `💡 ${data.followup}`,
          isFollowup: true 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting to the server. Please make sure the HealthBot server is running on port 8000.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Chat cleared. How can I help you today?' }
    ]);
  };

  return (
    <Container fluid className="py-4" style={{ maxWidth: '900px', height: 'calc(100vh - 120px)' }}>
      <Card className="h-100 shadow-sm border-0">
        <Card.Header className="d-flex align-items-center justify-content-between bg-success text-white py-3">
          <div className="d-flex align-items-center">
            <Robot size={24} className="me-2" />
            <strong>Health Assistant</strong>
            <Badge bg="light" text="success" className="ms-2">AI</Badge>
          </div>
          <Button variant="outline-light" size="sm" onClick={handleClearChat}>
            <Trash size={16} className="me-1" /> Clear
          </Button>
        </Card.Header>
        
        <Card.Body className="d-flex flex-column" style={{ overflow: 'hidden' }}>
          <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div 
                  className={`d-flex align-items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  style={{ maxWidth: '75%' }}
                >
                  {msg.role === 'assistant' && (
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 36, height: 36, flexShrink: 0 }}>
                      <Robot size={20} className="text-white" />
                    </div>
                  )}
                  <div 
                    className={`p-3 rounded-3 ${msg.role === 'user' ? 'bg-primary text-white' : msg.isFollowup ? 'bg-warning text-dark' : 'bg-light'}`}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center ms-2" style={{ width: 36, height: 36, flexShrink: 0 }}>
                      <Person size={20} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="d-flex align-items-start">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 36, height: 36 }}>
                    <Robot size={20} className="text-white" />
                  </div>
                  <div className="bg-light p-3 rounded-3">
                    <div className="d-flex gap-1">
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                    </div>
                    <style>{`
                      .dot {
                        animation: bounce 1.4s infinite ease-in-out both;
                      }
                      .dot:nth-child(1) { animation-delay: -0.32s; }
                      .dot:nth-child(2) { animation-delay: -0.16s; }
                      @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                      }
                    `}</style>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <Form className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Type your health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              size="lg"
            />
            <Button 
              variant="success" 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              style={{ width: '60px' }}
            >
              <Send size={20} />
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HealthBotPage;