import { Menu, Moon, Plus, Search, SunMedium } from "lucide-react";
import { Link } from "react-router-dom";

function Topbar({
  pageTitle,
  searchTerm,
  onSearchChange,
  theme,
  onThemeToggle,
  onMenuToggle,
}) {
  const isDark = theme === "dark";

  return (
    <header className="topbar">
      <div className="topbar-title-group">
        <button
          type="button"
          className="icon-button menu-button"
          onClick={onMenuToggle}
          aria-label="Open sidebar menu"
        >
          <Menu size={18} />
        </button>
        <div className="topbar-heading">
          <p className="eyebrow">Blog management</p>
          <h2>{pageTitle}</h2>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="search-field" htmlFor="post-search">
          <Search size={16} />
          <input
            id="post-search"
            type="text"
            placeholder="Search titles, authors, content, or tags"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <button type="button" className="icon-button" onClick={onThemeToggle}>
          {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
          <span>{isDark ? "Light" : "Dark"} Mode</span>
        </button>

        <Link to="/create" className="primary-button">
          <Plus size={18} />
          <span>New Post</span>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
