import { LayoutDashboard, FileText, SquarePen, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/posts", label: "Posts", icon: FileText },
  { to: "/create", label: "Create Post", icon: SquarePen },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-badge">BD</div>
        <div>
          <h1>BlogDesk</h1>
          <p>Content control panel</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " sidebar-link-active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
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
