import React from 'react'

export function MutabaahPageHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <header className="mutabaah-page-header">
      <style>{`
        .mutabaah-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.25rem;
          padding: 0 1.5rem;
        }
        .mutabaah-header-title-box {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .mutabaah-header-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #F0FDF4;
          color: #0E5C44;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(14, 92, 68, 0.08);
        }
        .mutabaah-header-text span {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #1E8E5A;
        }
        .mutabaah-header-text h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #172033;
          margin: 0.15rem 0;
          letter-spacing: -0.02em;
        }
        .mutabaah-header-text p {
          font-size: 0.875rem;
          color: #64748B;
          margin: 0;
        }
        .mutabaah-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      `}</style>

      <div className="mutabaah-header-title-box">
        {Icon && (
          <div className="mutabaah-header-icon">
            <Icon size={22} />
          </div>
        )}
        <div className="mutabaah-header-text">
          <span>Mutaba’ah Yaumiyyah</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      {actions && <div className="mutabaah-header-actions">{actions}</div>}
    </header>
  )
}

export default MutabaahPageHeader
