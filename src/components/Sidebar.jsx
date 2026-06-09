import {
  FileText,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  SquarePen,
  Tags,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/posts", label: "Posts", icon: FileText },
  { to: "/authors", label: "Authors", icon: Users },
  { to: "/tags", label: "Tags", icon: Tags },
  { to: "/create", label: "Create Post", icon: SquarePen },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({
  isCollapsed,
  isMobileView,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}) {
  const isCompact = isCollapsed && !isMobileView;
  const ToggleIcon = isMobileView ? X : isCompact ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={`sidebar${isCompact ? " sidebar-compact" : ""}${
        isMobileView ? " sidebar-mobile" : ""
      }${isMobileOpen ? " sidebar-mobile-visible" : ""}`}
    >
      <div className="sidebar-header">
        <div className="brand-block">
          <div className="brand-badge">BD</div>
          <div className="brand-details">
            <h1>BlogDesk</h1>
            <p>Content control panel</p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          aria-label={isMobileView ? "Close sidebar" : "Toggle sidebar"}
          onClick={isMobileView ? onCloseMobile : onToggleCollapse}
        >
          <ToggleIcon size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={isMobileView ? onCloseMobile : undefined}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " sidebar-link-active" : ""}`
            }
          >
            <Icon size={18} />
            <span className="sidebar-link-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Premium blogging workflow with a simple, focused layout.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
