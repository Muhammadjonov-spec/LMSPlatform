export const getImageUrl = (path) => {
  if (!path) return "/assets/images/thumbnails/th-1.png";
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};
