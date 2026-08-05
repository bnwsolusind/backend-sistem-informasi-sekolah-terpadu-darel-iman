import React from 'react'

export function MutabaahStatusBadge({ status, label, icon: Icon }) {
  const statusMaps = {
    active: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC', text: label || 'Aktif' },
    signed: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC', text: label || 'Ditandatangani' },
    tercapai: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC', text: label || 'Tercapai' },
    inactive: { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', text: label || 'Nonaktif' },
    unsigned: { bg: '#FEF3C7', color: '#854D0E', border: '#FDE047', text: label || 'Belum Paraf' },
    pending: { bg: '#FEF3C7', color: '#854D0E', border: '#FDE047', text: label || 'Menunggu' },
    perlu_bimbingan: { bg: '#FFEDD5', color: '#C2410C', border: '#FDBA74', text: label || 'Perlu Bimbingan' },
    draft: { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', text: label || 'Draft' },
    rejected: { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5', text: label || 'Bermasalah' },
  }

  const badge = statusMaps[status] || statusMaps.active

  return (
    <span
      className="mutabaah-status-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: badge.bg,
        color: badge.color,
        border: `1px solid ${badge.border}`,
        lineHeight: 1.2,
      }}
    >
      {Icon && <Icon size={12} />}
      <span>{badge.text}</span>
    </span>
  )
}

export default MutabaahStatusBadge
