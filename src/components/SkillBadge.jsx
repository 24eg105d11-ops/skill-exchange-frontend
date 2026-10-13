import React from 'react';

export function SkillBadge({ name, category, proficiency, type }) {
  const getProficiencyClass = () => {
    switch ((proficiency || '').toUpperCase()) {
      case 'EXPERT':
        return 'badge-expert';
      case 'ADVANCED':
        return 'badge-advanced';
      case 'INTERMEDIATE':
        return 'badge-intermediate';
      default:
        return 'badge-beginner';
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', margin: '0.2rem' }}>
      <span className={`badge ${type === 'OFFERED' ? 'badge-offered' : 'badge-wanted'}`}>
        {type === 'OFFERED' ? 'Teaches' : 'Wants'}: {name}
      </span>
      {proficiency && (
        <span className={`badge ${getProficiencyClass()}`}>
          {proficiency}
        </span>
      )}
    </div>
  );
}
