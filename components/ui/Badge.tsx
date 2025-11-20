import React from 'react';
import { DocumentStatus } from '../../types';

interface BadgeProps {
  status: DocumentStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles = {
    [DocumentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [DocumentStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
    [DocumentStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
  };

  const labels = {
    [DocumentStatus.PENDING]: 'Aguardando',
    [DocumentStatus.APPROVED]: 'Aprovado',
    [DocumentStatus.REJECTED]: 'Reprovado',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};