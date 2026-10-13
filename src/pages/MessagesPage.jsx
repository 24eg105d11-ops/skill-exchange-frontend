import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchMessages(activeConversation.id, true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/conversations');
      setConversations(data || []);
      if (data && data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setMessagesLoading(true);
      const data = await api.get(`/api/conversations/${conversationId}/messages`);
      setMessages(data || []);
    } catch (err) {
      if (!silent) setError(err.message || 'Failed to load messages.');
    } finally {
      if (!silent) setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const content = messageInput.trim();
    setMessageInput('');
    setSending(true);

    try {
      const newMsg = await api.post(`/api/conversations/${activeConversation.id}/messages`, {
        content,
      });
      setMessages((prev) => [...prev, newMsg]);

      // Update last message preview in list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, lastMessage: content, lastMessageTime: new Date().toISOString() }
            : c
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading && conversations.length === 0) return <LoadingSpinner message="Loading messages..." />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Exchange Messages</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Direct communication channels tied to your accepted skill exchanges
        </p>
      </div>

      <AlertBanner message={error} onClose={() => setError('')} />

      {conversations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3 className="empty-title">No Active Conversations</h3>
          <p className="empty-desc">
            Direct chat threads are created automatically when an exchange request is accepted by you or a partner.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', height: '620px' }}>
          {/* Left: Conversations List */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.95rem' }}>
              Active Discussions ({conversations.length})
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.map((c) => {
                const isSelected = activeConversation?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConversation(c)}
                    style={{
                      padding: '0.9rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)' }}>
                        {c.partnerName}
                      </span>
                      {c.unreadCount > 0 && (
                        <span className="badge badge-status-rejected" style={{ fontSize: '0.65rem' }}>
                          {c.unreadCount} new
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                      {c.offeredSkillName} &harr; {c.wantedSkillName}
                    </div>

                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {c.lastMessage || 'No messages yet. Start chatting!'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chat Window */}
          {activeConversation ? (
            <div className="chat-container">
              {/* Chat Header */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{activeConversation.partnerName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Exchange: <strong>{activeConversation.offeredSkillName}</strong> &bull; <strong>{activeConversation.wantedSkillName}</strong>
                  </div>
                </div>
                <span className="badge badge-status-accepted">{activeConversation.exchangeStatus}</span>
              </div>

              {/* Chat Messages */}
              <div className="chat-messages">
                {messagesLoading ? (
                  <LoadingSpinner message="Fetching chat history..." />
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    👋 Say hello to {activeConversation.partnerName} and arrange your first learning session!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`chat-bubble ${isMine ? 'bubble-mine' : 'bubble-partner'}`}
                      >
                        {!isMine && (
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                            {m.senderName}
                          </div>
                        )}
                        <div>{m.content}</div>
                        <div className="bubble-time">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="form-input"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" className="btn btn-primary" disabled={sending || !messageInput.trim()}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>Select a conversation from the left to start chatting.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
