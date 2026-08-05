import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileSpreadsheet,
  Target,
  CalendarDays,
  FileCode2,
  BookmarkPlus,
  UserCheck,
  ShieldCheck,
} from 'lucide-react'

export function MutabaahSubNav() {
  const navItems = [
    { path: '/dashboard/mutabaah', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/dashboard/mutabaah/rekap', label: 'Rekap', icon: FileSpreadsheet },
    { path: '/dashboard/mutabaah/target-evaluasi', label: 'Target & Evaluasi', icon: Target },
    { path: '/dashboard/mutabaah/rincian-agenda', label: 'Agenda TU', icon: CalendarDays },
    { path: '/dashboard/mutabaah/template-agenda', label: 'Template Agenda', icon: FileCode2 },
    { path: '/dashboard/mutabaah/assign-template', label: 'Assign Template', icon: BookmarkPlus },
    { path: '/dashboard/mutabaah/assign-pembimbing', label: 'Assign Pembimbing', icon: UserCheck },
    { path: '/dashboard/mutabaah/monitoring-orang-tua', label: 'Monitoring Ortu', icon: ShieldCheck },
  ]

  return (
    <nav className="mutabaah-subnav-container" aria-label="Navigasi Kontekstual Mutaba'ah">
      <style>{`
        .mutabaah-subnav-container {
          background: #ffffff;
          border-bottom: 1px solid #E2E8F0;
          padding: 0 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .mutabaah-subnav-container::-webkit-scrollbar {
          display: none;
        }
        .mutabaah-subnav-list {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
          white-space: nowrap;
        }
        .mutabaah-subnav-item a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748B;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .mutabaah-subnav-item a:hover {
          color: #0E5C44;
          background: #F8FAFC;
        }
        .mutabaah-subnav-item a.active {
          color: #0E5C44;
          font-weight: 600;
          border-bottom-color: #0E5C44;
          background: #F0FDF4;
        }
      `}</style>
      <ul className="mutabaah-subnav-list">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.path} className="mutabaah-subnav-item">
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MutabaahSubNav
