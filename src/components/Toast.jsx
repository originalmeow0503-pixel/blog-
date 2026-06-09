function Toast({ toast }) {
  if (!toast) {
    return null;
  }

  return <div className="toast">{toast.message}</div>;
}

export default Toast;
