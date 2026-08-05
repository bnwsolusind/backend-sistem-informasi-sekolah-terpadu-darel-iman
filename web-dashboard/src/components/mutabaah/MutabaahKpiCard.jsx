import React from 'react'

export function MutabaahKpiCard({ title, value, subtitle, icon: Icon, trend, color = 'emerald', onClick }) {
  const colorMaps = {
    emerald: { bg: '#F0FDF4', iconColor: '#0E5C44', border: '#DCFCE7' },
    blue: { bg: '#EFF6FF', iconColor: '#2563EB', border: '#DBEAFE' },
    amber: { bg: '#FFFBEB', iconColor: '#D97706', border: '#FEF3C7' },
    red: { bg: '#FEF2F2', iconColor: '#DC2626', border: '#FEE2E2' },
    purple: { bg: '#FAF5FF', iconColor: '#9333EA', border: '#F3E8FF' },
  }

  const scheme = colorMaps[color] || colorMaps.emerald

  return (
    <article
      className={`mutabaah-kpi-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <style>{`
        .mutabaah-kpi-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 1.25rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .mutabaah-kpi-card.clickable {
          cursor: pointer;
        }
        .mutabaah-kpi-card.clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          border-color: #CBD5E1;
        }
        .mutabaah-kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .mutabaah-kpi-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mutabaah-kpi-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #64748B;
          margin: 0;
        }
        .mutabaah-kpi-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #172033;
          margin: 0.1rem 0;
          letter-spacing: -0.02em;
        }
        .mutabaah-kpi-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #64748B;
        }
        .mutabaah-kpi-trend {
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
        }
        .mutabaah-kpi-trend.up {
          background: #DCFCE7;
          color: #166534;
        }
        .mutabaah-kpi-trend.down {
          background: #FEE2E2;
          color: #991B1B;
        }
      `}</style>

      <div className="mutabaah-kpi-header">
        <span className="mutabaah-kpi-label">{title}</span>
        {Icon && (
          <div
            className="mutabaah-kpi-icon"
            style={{ background: scheme.bg, color: scheme.iconColor, border: `1px solid ${scheme.border}` }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="mutabaah-kpi-value">{value}</div>

      <div className="mutabaah-kpi-footer">
        <span>{subtitle}</span>
        {trend && (
          <span className={`mutabaah-kpi-trend ${trend.type === 'up' ? 'up' : 'down'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </article>
  )
}

export default MutabaahKpiCard
