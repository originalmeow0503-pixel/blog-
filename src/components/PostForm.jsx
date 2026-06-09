import { useEffect, useState } from "react";

const createFormState = (initialData) => ({
  title: initialData?.title ?? "",
  author: initialData?.author ?? "",
  tags: Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : "",
  content: initialData?.content ?? "",
});

function PostForm({
  initialData,
  onSubmit,
  submitLabel,
  formTitle,
  formDescription,
}) {
  const [formData, setFormData] = useState(createFormState(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(createFormState(initialData));
    setErrors({});
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!formData.author.trim()) {
      nextErrors.author = "Author is required.";
    }

    if (!formData.content.trim()) {
      nextErrors.content = "Content is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      author: formData.author.trim(),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      content: formData.content.trim(),
    });
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h3>{formTitle}</h3>
        <p>{formDescription}</p>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a clear post title"
          />
          {errors.title ? <span className="field-error">{errors.title}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="author">Author</label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter the author name"
          />
          {errors.author ? (
            <span className="field-error">{errors.author}</span>
          ) : null}
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="SEO, Writing, Product"
          />
          <span className="field-hint">Separate tags with commas.</span>
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write the full post content here"
          />
          {errors.content ? (
            <span className="field-error">{errors.content}</span>
          ) : null}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PostForm;
