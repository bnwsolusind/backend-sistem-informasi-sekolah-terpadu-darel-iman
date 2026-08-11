import React from 'react'
import { Drawer } from '../ui/drawer'

/**
 * AppDrawer - canonical side drawer / bottom sheet.
 * position: right | left | bottom
 */
export default function AppDrawer({ isOpen, onClose, title, description, icon: Icon, children, position = 'right', footer }) {
  if (!isOpen) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2.5">
          {Icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0E5C44]/10 text-[#0E5C44] dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate">{title}</span>
            {description && <span className="block text-[11px] font-medium text-slate-400">{description}</span>}
          </span>
        </span>
      }
      position={position}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1">{children}</div>
        {footer && <div className="mt-4 shrink-0 border-t border-slate-100 pt-4 dark:border-slate-800">{footer}</div>}
      </div>
    </Drawer>
  )
}
