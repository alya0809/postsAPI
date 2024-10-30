import axiosInstance from './axiosInstance';

export const updatePost = async (updatedPost) => {
  try {
    const response = await axiosInstance.put(`/posts/${updatedPost.id}`, {
      id: updatedPost.id,
      title: updatedPost.title,
      body: updatedPost.body,
      userId: updatedPost.userId || 1, 
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении поста:', error);
    throw error;
  }
};
