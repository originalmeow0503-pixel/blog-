import { Link } from "react-router-dom";

const formatDate = (dateValue) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));

const createPreview = (content = "") =>
  content.length > 150 ? `${content.slice(0, 150)}...` : content;

function PostCard({ post, onDelete }) {
  return (
    <article className="post-card">
      <div className="post-card-header">
        <div>
          <h4>{post.title}</h4>
          <p className="post-card-author">By {post.author}</p>
        </div>
        <span className="post-date-label">Updated {formatDate(post.updatedAt)}</span>
      </div>

      <p className="content-preview">{createPreview(post.content)}</p>

      <div className="tag-list">
        {post.tags.length > 0 ? (
          post.tags.map((tag) => (
            <span className="tag-chip" key={`${post.id}-${tag}`}>
              {tag}
            </span>
          ))
        ) : (
          <span className="tag-chip">No tags</span>
        )}
      </div>

      <div className="post-card-actions">
        <Link to={`/posts/${post.id}`} className="secondary-button small-button">
          View
        </Link>
        <Link
          to={`/posts/${post.id}/edit`}
          className="primary-button small-button"
        >
          Edit
        </Link>
        <button
          type="button"
          className="danger-button small-button"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default PostCard;
