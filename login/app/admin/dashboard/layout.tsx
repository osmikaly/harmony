import type { ReactNode } from "react"
import "../dashboard/styles.css"

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="admin-dashboard-container">
      <div className="admin-content-container">{children}</div>
    </div>
  )
}

