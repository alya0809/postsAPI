import PostService from '../services/postService';

export const PostController = {
  async fetchPosts() {
    try {
      return await PostService.getPosts();
    } catch (error) {
      console.error('Controller error in fetching posts', error);
      throw error;
    }
  },
  async addPost(postData) {
    try {
      return await PostService.addPost(postData);
    } catch (error) {
      console.error('Controller error in adding post', error);
      throw error;
    }
  },
  async updatePost(updatedPost) {  
    try {
      return await PostService.updatePost(updatedPost);  
    } catch (error) {
      console.error('Controller error in editing post', error);
      throw error;
    }
  },
  async deletePost(id) {
    try {
      return await PostService.deletePost(id);
    } catch (error) {
      console.error('Controller error in removing post', error);
      throw error;
    }
  },
};
