import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || 'PENDING').toUpperCase();

  const getBadgeClass = () => {
    switch (normalized) {
      case 'PENDING':
        return 'badge-status-pending';
      case 'ACCEPTED':
        return 'badge-status-accepted';
      case 'REJECTED':
        return 'badge-status-rejected';
      case 'CANCELLED':
        return 'badge-status-cancelled';
      case 'COMPLETED':
        return 'badge-status-completed';
      default:
        return 'badge-beginner';
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{normalized}</span>;
}
