import api from "./api";

export const getPosts = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
};

export const createPost = async (formData) => {
  const response = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

export const getMyPosts = async () => {
  const response = await api.get("/posts/my-posts");
  return response.data;
};

export const updatePost = async (postId, data) => {
  const response = await api.patch(`/posts/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};