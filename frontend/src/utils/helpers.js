export const getImageUrl = (path) => {
  if (!path) return "/assets/images/thumbnails/th-1.png";
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const separator = path.startsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${path.replace(/\\/g, '/')}`;
};
