import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';

export function AddSkillPage() {
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formData, setFormData] = useState({
    skillId: '',
    skillType: 'OFFERED',
    proficiencyLevel: 'INTERMEDIATE',
    notes: '',
  });

  // State for creating a new catalog skill directly
  const [showNewCatalogForm, setShowNewCatalogForm] = useState(false);
  const [newCatalogSkill, setNewCatalogSkill] = useState({
    name: '',
    category: 'Programming',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsData, catsData] = await Promise.all([
        api.get(selectedCategory ? `/api/skills?category=${encodeURIComponent(selectedCategory)}` : '/api/skills'),
        api.get('/api/skills/categories'),
      ]);
      setCatalogSkills(skillsData || []);
      setCategories(catsData || []);

      if (skillsData && skillsData.length > 0 && !formData.skillId) {
        setFormData((prev) => ({ ...prev, skillId: skillsData[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load skill catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skillId) {
      setError('Please select a skill from the list.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/user-skills', {
        skillId: Number(formData.skillId),
        skillType: formData.skillType,
        proficiencyLevel: formData.proficiencyLevel,
        notes: formData.notes,
      });

      setSuccess('Skill successfully added to your profile!');
      setTimeout(() => navigate('/my-skills'), 1000);
    } catch (err) {
      setError(err.message || 'Failed to add skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCatalogSkill = async (e) => {
    e.preventDefault();
    if (!newCatalogSkill.name.trim()) return;

    try {
      setSubmitting(true);
      const created = await api.post('/api/skills', newCatalogSkill);
      setCatalogSkills([...catalogSkills, created]);
      setFormData((prev) => ({ ...prev, skillId: created.id }));
      setShowNewCatalogForm(false);
      setNewCatalogSkill({ name: '', category: 'Programming', description: '' });
      setSuccess(`Added "${created.name}" to global catalog! You can now link it below.`);
    } catch (err) {
      setError(err.message || 'Failed to create skill in catalog.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && catalogSkills.length === 0) return <LoadingSpinner message="Loading catalog..." />;

  return (
    <div className="container-narrow">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Add Skill to Profile</h1>
            <p className="card-subtitle">List a skill you can teach or one you want to learn</p>
          </div>
          <Link to="/my-skills" className="btn btn-secondary btn-sm">
            Cancel
          </Link>
        </div>

        <AlertBanner type="success" message={success} />
        <AlertBanner message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          {/* Skill Type: Offered vs Wanted */}
          <div className="form-group">
            <label className="form-label">Role in Skill Barter *</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="skillType"
                  value="OFFERED"
                  checked={formData.skillType === 'OFFERED'}
                  onChange={handleChange}
                />
                <strong>Skill I can TEACH (Offered)</strong>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="skillType"
                  value="WANTED"
                  checked={formData.skillType === 'WANTED'}
                  onChange={handleChange}
                />
                <strong>Skill I want to LEARN (Wanted)</strong>
              </label>
            </div>
          </div>

          {/* Filter by Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="categoryFilter">Filter Catalog by Category</label>
            <select
              id="categoryFilter"
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories ({catalogSkills.length} skills available)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Select Skill */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" htmlFor="skillId" style={{ margin: 0 }}>Select Skill *</label>
              <button
                type="button"
                onClick={() => setShowNewCatalogForm(!showNewCatalogForm)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600 }}
              >
                {showNewCatalogForm ? 'Close New Skill' : '+ Not in list? Create New'}
              </button>
            </div>

            <select
              id="skillId"
              name="skillId"
              className="form-select"
              required
              value={formData.skillId}
              onChange={handleChange}
            >
              {catalogSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Collapsible New Catalog Skill Form */}
          {showNewCatalogForm && (
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Add New Skill to Platform Catalog</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Skill Name (e.g. Kotlin, Docker)"
                  className="form-input"
                  value={newCatalogSkill.name}
                  onChange={(e) => setNewCatalogSkill({ ...newCatalogSkill, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Programming)"
                  className="form-input"
                  value={newCatalogSkill.category}
                  onChange={(e) => setNewCatalogSkill({ ...newCatalogSkill, category: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Short description of this skill..."
                className="form-textarea"
                style={{ minHeight: '60px', marginBottom: '0.75rem' }}
                value={newCatalogSkill.description}
                onChange={(e) => setNewCatalogSkill({ ...newCatalogSkill, description: e.target.value })}
              />
              <button
                type="button"
                onClick={handleCreateCatalogSkill}
                className="btn btn-secondary btn-sm"
              >
                Save to Catalog &amp; Select
              </button>
            </div>
          )}

          {/* Proficiency Level */}
          <div className="form-group">
            <label className="form-label" htmlFor="proficiencyLevel">Your Proficiency Level *</label>
            <select
              id="proficiencyLevel"
              name="proficiencyLevel"
              className="form-select"
              value={formData.proficiencyLevel}
              onChange={handleChange}
            >
              <option value="BEGINNER">Beginner (Foundational understanding / seeking basic guidance)</option>
              <option value="INTERMEDIATE">Intermediate (Able to build projects / good understanding)</option>
              <option value="ADVANCED">Advanced (Strong practical expertise / can teach effectively)</option>
              <option value="EXPERT">Expert (Deep mastery / extensive experience)</option>
            </select>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label" htmlFor="notes">Notes / Specialization (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              placeholder="e.g. Experienced with React Hooks and Redux; or Want to focus on OOP concepts in Java..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Adding Skill...' : 'Add to My Profile'}
            </button>
            <Link to="/my-skills" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
