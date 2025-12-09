import env from "./env";

export const getImageSrc = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${env.API_URL}${path}`;
  }
  return `${env.API_URL}/public/uploads/${path}`;
};
