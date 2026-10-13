import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { SkillBadge } from '../components/SkillBadge';

export function UserPublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [peer, setPeer] = useState(null);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Exchange proposal form state
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [wantedSkillId, setWantedSkillId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [peerData, mySkillsData] = await Promise.all([
        api.get(`/api/users/${id}`),
        api.get('/api/user-skills/me').catch(() => []),
      ]);

      setPeer(peerData);
      setMySkills(mySkillsData || []);

      // Auto-select initial options
      if (peerData?.skillsOffered?.length > 0) {
        setWantedSkillId(peerData.skillsOffered[0].skillId);
      }

      const myOffered = (mySkillsData || []).filter((s) => s.skillType === 'OFFERED');
      if (myOffered.length > 0) {
        setOfferedSkillId(myOffered[0].skillId);
      }
    } catch (err) {
      setError(err.message || 'Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendExchange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!offeredSkillId || !wantedSkillId) {
      setError('Please select both a skill to learn and a skill to offer in return.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/exchanges', {
        receiverId: Number(id),
        offeredSkillId: Number(offeredSkillId),
        wantedSkillId: Number(wantedSkillId),
        message: message.trim(),
      });

      setSuccess('Skill exchange request sent successfully! The recipient has been notified.');
      setTimeout(() => navigate('/requests/outgoing'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to send exchange request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading user profile..." />;

  const myOfferedSkills = mySkills.filter((s) => s.skillType === 'OFFERED');

  return (
    <div className="container-narrow">
      <AlertBanner type="success" message={success} />
      <AlertBanner message={error} onClose={() => setError('')} />

      {/* User Header */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{peer?.fullName}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{peer?.email}</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-beginner">Mode: {peer?.preferredLearningMode}</span>
            </div>
          </div>
          <a href="#exchange" className="btn btn-primary">
            Propose Skill Exchange &darr;
          </a>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>About</h3>
          <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
            {peer?.bio || 'No biography provided.'}
          </p>
        </div>
      </div>

      {/* Skills Offered & Wanted */}
      <div className="grid-cols-2" style={{ marginBottom: '1.75rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.75rem' }}>
            Skills {peer?.fullName?.split(' ')[0]} Can Teach
          </h3>
          {(!peer?.skillsOffered || peer.skillsOffered.length === 0) ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills listed to teach.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {peer.skillsOffered.map((s) => (
                <SkillBadge key={s.id} name={s.skillName} proficiency={s.proficiencyLevel} type="OFFERED" />
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#92400e', marginBottom: '0.75rem' }}>
            Skills {peer?.fullName?.split(' ')[0]} Wants to Learn
          </h3>
          {(!peer?.skillsWanted || peer.skillsWanted.length === 0) ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills listed to learn.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {peer.skillsWanted.map((s) => (
                <SkillBadge key={s.id} name={s.skillName} proficiency={s.proficiencyLevel} type="WANTED" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Formal Barter Proposal Card */}
      <div id="exchange" className="card" style={{ border: '2px solid var(--border-focus)' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Initiate Skill Exchange with {peer?.fullName}</h2>
            <p className="card-subtitle">Choose which skill you will teach and which skill you want to learn</p>
          </div>
          <span className="badge badge-advanced">Peer Barter</span>
        </div>

        {myOfferedSkills.length === 0 ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p className="empty-desc">
              You must list at least one skill you can teach before initiating an exchange request.
            </p>
            <Link to="/my-skills/add" className="btn btn-primary btn-sm">
              + Add Offered Skill First
            </Link>
          </div>
        ) : (!peer?.skillsOffered || peer.skillsOffered.length === 0) ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p className="empty-desc">
              This user hasn't listed any skills they can teach yet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendExchange}>
            <div className="form-group">
              <label className="form-label" htmlFor="wantedSkillId">
                1. What do you want to LEARN from {peer?.fullName}? *
              </label>
              <select
                id="wantedSkillId"
                className="form-select"
                required
                value={wantedSkillId}
                onChange={(e) => setWantedSkillId(e.target.value)}
              >
                {peer.skillsOffered.map((s) => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} ({s.proficiencyLevel} proficiency)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="offeredSkillId">
                2. What skill will you TEACH in return? *
              </label>
              <select
                id="offeredSkillId"
                className="form-select"
                required
                value={offeredSkillId}
                onChange={(e) => setOfferedSkillId(e.target.value)}
              >
                {myOfferedSkills.map((s) => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} (Your level: {s.proficiencyLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proposalMessage">
                3. Introduction &amp; Learning Goals Message (Optional)
              </label>
              <textarea
                id="proposalMessage"
                className="form-textarea"
                placeholder="Introduce yourself, mention your availability (e.g. weekends, 2 hours/week), and how you'd like to structure the exchange..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Submitting Request...' : 'Send Skill Exchange Proposal'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
