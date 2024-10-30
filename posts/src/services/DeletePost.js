import axiosInstance from './axiosInstance';

export const deletePost = async (id) => {
  try {
    await axiosInstance.delete(`/posts/${id}`);
    console.log(`Пост с id ${id} успешно удален.`);
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    throw error;
  }
};
