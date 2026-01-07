const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_PUBLIC_BASE_API_DEV_URL
    : import.meta.env.VITE_PUBLIC_BASE_API_URL;

export default baseURL;
