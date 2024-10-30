import axiosInstance from './axiosInstance';

export const addPost = async (post) => {
  try {
    const response = await axiosInstance.post('/posts', post);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении поста:', error);
    throw error;
  }
};
