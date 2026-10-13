import React, { useState } from 'react';
import { api } from '../api/apiClient';
import { AlertBanner } from '../components/AlertBanner';

export function AiAssistantPage() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      answer: 'Hello! I am your Skill Exchange Platform AI Guide. I am grounded in verified platform documentation and user manuals. How can I assist you with skills, exchanges, or partner discovery today?',
      sources: ['Platform Guide Introduction (GETTING_STARTED)'],
      confidence: 1.0,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleQuestions = [
    'How do I add a skill to my profile?',
    'How does the partner matching algorithm work?',
    'How do I send a skill exchange request?',
    'What happens after my request is accepted?',
    'How do I mark an exchange as completed?',
    'Can I charge money or fees for lessons?',
  ];

  const handleAsk = async (queryText) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setError('');
    setQuestion('');
    setLoading(true);

    // Append user query to UI immediately
    const userEntry = { sender: 'user', text: q };
    setChatHistory((prev) => [...prev, userEntry]);

    try {
      const data = await api.post('/api/ai/chat', { question: q });
      const assistantEntry = {
        sender: 'assistant',
        answer: data.answer,
        sources: data.retrievedSources || [],
        confidence: data.confidenceScore || 0,
      };
      setChatHistory((prev) => [...prev, assistantEntry]);
    } catch (err) {
      setError(err.message || 'Failed to communicate with RAG Assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow">
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
          RAG AI Assistant &bull; Grounded Knowledge
        </span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Platform AI Guide</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Retrieval-Augmented Generation (RAG) assistant grounded strictly in verified platform documentation
        </p>
      </div>

      <AlertBanner message={error} onClose={() => setError('')} />

      {/* Suggested Questions Quick Chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
          Frequently Asked Questions (Click to Ask):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(sq)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem', borderRadius: 'var(--radius-full)' }}
              disabled={loading}
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread Box */}
      <div
        className="card"
        style={{
          minHeight: '440px',
          maxHeight: '560px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.25rem',
          marginBottom: '1rem',
          backgroundColor: '#f8fafc',
        }}
      >
        {chatHistory.map((item, idx) => {
          if (item.sender === 'user') {
            return (
              <div
                key={idx}
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '80%',
                  fontSize: '0.925rem',
                }}
              >
                {item.text}
              </div>
            );
          }

          return (
            <div
              key={idx}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'white',
                border: '1px solid var(--border-color)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                maxWidth: '90%',
                fontSize: '0.925rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  🤖 Platform AI Guide
                </span>
                {item.confidence > 0 && (
                  <span className="badge badge-advanced" style={{ fontSize: '0.7rem' }}>
                    Confidence: {(item.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              <div style={{ lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                {item.answer}
              </div>

              {item.sources?.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Grounding Sources:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                    {item.sources.map((src, sIdx) => (
                      <span key={sIdx} className="badge badge-beginner" style={{ fontSize: '0.7rem' }}>
                        📄 {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '0.75rem 1rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Retrieving relevant documentation and synthesizing answer...
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Ask a question about the Skill Exchange Platform..."
          className="form-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !question.trim()}>
          {loading ? 'Asking...' : 'Ask AI'}
        </button>
      </form>
    </div>
  );
}
