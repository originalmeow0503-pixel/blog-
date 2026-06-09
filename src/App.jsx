import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Clock3, FileText, Tags, Users } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PostCard from "./components/PostCard";
import PostForm from "./components/PostForm";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { samplePosts } from "./data/samplePosts";

const storageKey = "blogdesk_posts";
const recentWindowInMs = 7 * 24 * 60 * 60 * 1000;

const createPostId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return Date.now().toString();
};

const formatDate = (dateValue) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizePost = (post) => {
  const fallbackDate = new Date().toISOString();

  return {
    id: post.id ? String(post.id) : createPostId(),
    title: post.title ?? "Untitled Post",
    author: post.author ?? "Unknown Author",
    content: post.content ?? post.summary ?? "",
    tags: normalizeTags(post.tags),
    createdAt: post.createdAt ?? post.updatedAt ?? fallbackDate,
    updatedAt: post.updatedAt ?? post.createdAt ?? fallbackDate,
  };
};

const savePostsToStorage = (posts) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(posts));
};

const sanitizePosts = (rawPosts) => {
  const usedIds = new Set();
  let wasRepaired = false;

  const posts = rawPosts.map((post) => {
    const normalizedPost = normalizePost(post);
    let nextId = normalizedPost.id;

    if (!post?.id) {
      wasRepaired = true;
    }

    while (usedIds.has(nextId)) {
      nextId = createPostId();
      wasRepaired = true;
    }

    if (nextId !== normalizedPost.id) {
      wasRepaired = true;
    }

    usedIds.add(nextId);

    return {
      ...normalizedPost,
      id: nextId,
    };
  });

  return {
    posts,
    wasRepaired,
  };
};

const getInitialPosts = () => {
  const fallbackPosts = sanitizePosts(samplePosts).posts;

  if (typeof window === "undefined") {
    return fallbackPosts;
  }

  const savedPosts = window.localStorage.getItem(storageKey);

  if (savedPosts === null) {
    savePostsToStorage(fallbackPosts);
    return fallbackPosts;
  }

  try {
    const parsedPosts = JSON.parse(savedPosts);

    if (!Array.isArray(parsedPosts)) {
      savePostsToStorage(fallbackPosts);
      return fallbackPosts;
    }

    const { posts, wasRepaired } = sanitizePosts(parsedPosts);

    if (wasRepaired) {
      savePostsToStorage(posts);
    }

    return posts;
  } catch (error) {
    console.error("Could not load saved BlogDesk posts.", error);
    savePostsToStorage(fallbackPosts);
    return fallbackPosts;
  }
};

const sortPostsByUpdatedAt = (posts) =>
  [...posts].sort(
    (firstPost, secondPost) =>
      new Date(secondPost.updatedAt) - new Date(firstPost.updatedAt),
  );

const getPostById = (posts, id) =>
  posts.find((post) => String(post.id) === String(id));

const wasUpdatedRecently = (dateValue) =>
  Date.now() - new Date(dateValue).getTime() <= recentWindowInMs;

const getPageTitle = (pathname) => {
  if (pathname === "/") {
    return "Dashboard Overview";
  }

  if (pathname === "/posts") {
    return "All Posts";
  }

  if (pathname === "/create") {
    return "Create Post";
  }

  if (pathname === "/settings") {
    return "Settings";
  }

  if (pathname.endsWith("/edit")) {
    return "Edit Post";
  }

  if (pathname.startsWith("/posts/")) {
    return "View Post";
  }

  return "BlogDesk";
};

function DashboardHome({ posts }) {
  const latestPosts = sortPostsByUpdatedAt(posts).slice(0, 3);
  const uniqueAuthorsCount = new Set(posts.map((post) => post.author)).size;
  const uniqueTagsCount = new Set(posts.flatMap((post) => post.tags)).size;
  const recentlyUpdatedCount = posts.filter((post) =>
    wasUpdatedRecently(post.updatedAt),
  ).length;

  const stats = [
    {
      title: "Total Posts",
      value: posts.length,
      detail: "Posts currently saved in BlogDesk",
      icon: FileText,
    },
    {
      title: "Total Authors",
      value: uniqueAuthorsCount,
      detail: "Writers represented in your post library",
      icon: Users,
    },
    {
      title: "Total Tags",
      value: uniqueTagsCount,
      detail: "Topics used across your saved content",
      icon: Tags,
    },
    {
      title: "Recently Updated",
      value: recentlyUpdatedCount,
      detail: "Posts updated in the last 7 days",
      icon: Clock3,
    },
  ];

  return (
    <div className="page-stack">
      <section className="stats-grid">
        {stats.map(({ title, value, detail, icon: Icon }) => (
          <article className="card stat-card" key={title}>
            <div className="stat-card-head">
              <span>{title}</span>
              <div className="icon-chip">
                <Icon size={18} />
              </div>
            </div>
            <strong>{value}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h3>Latest post updates</h3>
            </div>
            <span className="badge">{latestPosts.length} shown</span>
          </div>

          <div className="post-list">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <div className="post-row" key={post.id}>
                  <div>
                    <h4>{post.title}</h4>
                    <p>{post.author}</p>
                  </div>
                  <div className="post-row-meta">
                    <small>Updated {formatDate(post.updatedAt)}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h4>No posts yet</h4>
                <p>Your latest post activity will appear here once posts are added.</p>
              </div>
            )}
          </div>
        </article>

        <article className="card highlight-card">
          <p className="eyebrow">Team note</p>
          <h3>Keep your editorial workflow visible.</h3>
          <p>
            BlogDesk now supports full local CRUD, so your posts, updates, and
            dashboard stats stay synced through localStorage.
          </p>
        </article>
      </section>
    </div>
  );
}

function PostsPage({ posts, onDeletePost, onShowToast }) {
  const [postToDelete, setPostToDelete] = useState(null);
  const sortedPosts = sortPostsByUpdatedAt(posts);

  const handleConfirmDelete = () => {
    if (!postToDelete) {
      return;
    }

    onDeletePost(postToDelete.id);
    onShowToast("Post deleted successfully");
    setPostToDelete(null);
  };

  return (
    <>
      <section className="card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Posts library</p>
            <h3>All posts</h3>
          </div>
          <span className="badge">{posts.length} results</span>
        </div>

        <div className="posts-grid">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={() => setPostToDelete(post)}
              />
            ))
          ) : (
            <div className="empty-state">
              <h4>No posts saved</h4>
              <p>Your saved posts will appear here when BlogDesk has content to show.</p>
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={Boolean(postToDelete)}
        title="Delete post"
        message="Are you sure you want to delete this post?"
        onCancel={() => setPostToDelete(null)}
        onConfirm={handleConfirmDelete}
        confirmLabel="Delete"
      />
    </>
  );
}

function CreatePostPage({ onAddPost, onShowToast, onClearSearch }) {
  const navigate = useNavigate();

  const handleCreatePost = (newPost) => {
    onAddPost(newPost);
    onClearSearch();
    onShowToast("Post created successfully");
    navigate("/posts");
  };

  return (
    <section className="form-shell">
      <div className="page-header-block">
        <p className="eyebrow">New content</p>
        <h3>Create a blog post</h3>
        <p>Fill in the core details below to add a new post to BlogDesk.</p>
      </div>

      <PostForm
        onSubmit={handleCreatePost}
        submitLabel="Create Post"
        formTitle="Post details"
        formDescription="This form saves your new post directly to localStorage."
      />
    </section>
  );
}

function ViewPostPage({ posts }) {
  const { id } = useParams();
  const post = getPostById(posts, id);

  if (!post) {
    return <NotFoundState />;
  }

  return (
    <section className="card post-view">
      <div className="post-view-top">
        <div>
          <p className="eyebrow">Post details</p>
          <h3 className="post-view-title">{post.title}</h3>
          <p className="post-view-author">By {post.author}</p>
        </div>

        <Link to="/posts" className="secondary-button">
          Back to Posts
        </Link>
      </div>

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

      <div className="meta-grid">
        <div className="meta-item">
          <span>Created</span>
          <strong>{formatDate(post.createdAt)}</strong>
        </div>
        <div className="meta-item">
          <span>Last updated</span>
          <strong>{formatDate(post.updatedAt)}</strong>
        </div>
      </div>

      <article className="post-content">
        <p>{post.content}</p>
      </article>
    </section>
  );
}

function EditPostPage({ posts, onUpdatePost, onShowToast, onClearSearch }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const post = getPostById(posts, id);

  if (!post) {
    return <NotFoundState />;
  }

  const handleUpdatePost = (updatedPost) => {
    onUpdatePost(post.id, updatedPost);
    onClearSearch();
    onShowToast("Post updated successfully");
    navigate("/posts");
  };

  return (
    <section className="form-shell">
      <div className="page-header-block">
        <p className="eyebrow">Edit content</p>
        <h3>Update your post</h3>
        <p>Make your changes below and save them back to localStorage.</p>
      </div>

      <PostForm
        initialData={post}
        onSubmit={handleUpdatePost}
        submitLabel="Save Changes"
        formTitle="Edit post"
        formDescription="Update the title, author, tags, or content for this post."
      />
    </section>
  );
}

function SettingsPage() {
  return (
    <section className="card placeholder-card">
      <p className="eyebrow">Route placeholder</p>
      <h3>Settings</h3>
      <p>
        This placeholder route can grow into blog preferences, team options, and
        dashboard customization later.
      </p>
    </section>
  );
}

function NotFoundState() {
  return (
    <section className="card not-found-card">
      <p className="eyebrow">Missing content</p>
      <h3>Post not found</h3>
      <p>The post you are looking for is not available in BlogDesk.</p>
      <Link to="/posts" className="secondary-button">
        Back to Posts
      </Link>
    </section>
  );
}

function DashboardLayout({ theme, onThemeToggle, searchTerm, onSearchChange }) {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar />

      <main className="main-area">
        <Topbar
          pageTitle={pageTitle}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          theme={theme}
          onThemeToggle={onThemeToggle}
        />

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState(getInitialPosts);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showToast = (message) => {
    setToast({
      id: Date.now(),
      message,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const setAndStorePosts = (updater) => {
    setPosts((currentPosts) => {
      const nextPosts =
        typeof updater === "function" ? updater(currentPosts) : updater;

      savePostsToStorage(nextPosts);
      return nextPosts;
    });
  };

  const addPost = (newPost) => {
    const timestamp = new Date().toISOString();
    setAndStorePosts((currentPosts) => {
      const createdPost = normalizePost({
        ...newPost,
        id: createPostId(),
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return [createdPost, ...currentPosts];
    });
  };

  const updatePost = (id, updatedPost) => {
    setAndStorePosts((currentPosts) =>
      currentPosts.map((post) =>
        String(post.id) === String(id)
          ? normalizePost({
              ...post,
              ...updatedPost,
              id: post.id,
              createdAt: post.createdAt,
              updatedAt: new Date().toISOString(),
            })
          : post,
      ),
    );
  };

  const deletePost = (id) => {
    setAndStorePosts((currentPosts) =>
      currentPosts.filter((post) => String(post.id) !== String(id)),
    );
  };

  const filteredPosts = posts.filter((post) => {
    const searchableText = [
      post.title,
      post.author,
      post.content,
      ...post.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Routes>
        <Route
          element={
            <DashboardLayout
              theme={theme}
              onThemeToggle={() =>
                setTheme((currentTheme) =>
                  currentTheme === "light" ? "dark" : "light",
                )
              }
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          }
        >
          <Route index element={<DashboardHome posts={filteredPosts} />} />
          <Route
            path="posts"
            element={
              <PostsPage
                posts={filteredPosts}
                onDeletePost={deletePost}
                onShowToast={showToast}
              />
            }
          />
          <Route path="posts/:id" element={<ViewPostPage posts={posts} />} />
          <Route
            path="posts/:id/edit"
            element={
              <EditPostPage
                posts={posts}
                onUpdatePost={updatePost}
                onShowToast={showToast}
                onClearSearch={clearSearch}
              />
            }
          />
          <Route
            path="create"
            element={
              <CreatePostPage
                onAddPost={addPost}
                onShowToast={showToast}
                onClearSearch={clearSearch}
              />
            }
          />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      {toast ? <Toast key={toast.id} toast={toast} /> : null}
    </>
  );
}

export default App;
