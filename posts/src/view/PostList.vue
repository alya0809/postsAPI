<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">{{ $t('title') }}</h1>
      <button @click="openModal" class="btn btn-primary mb-4">{{ $t('addPost') }}</button>

      <div v-if="isLoading" class="flex justify-center my-4">
        <span class="loading loading-dots loading-lg"></span>
      </div>
  
      <!-- Список постов -->
      <ul>
        <li v-for="post in paginatedPosts" :key="post.id" class="card bg-base-100 shadow-lg mb-4">
          <div class="card-body">
            <h2 class="card-title">{{ post.title }}</h2>
            <p>{{ post.body }}</p>
            <div class="flex justify-end mt-4">
              <button @click="editPost(post)" class="btn btn-secondary mr-2">{{ $t('edit') }}</button>
              <button @click="deletePost(post.id)" class="btn btn-error">{{ $t('delete') }}</button>
            </div>
          </div>
        </li>
      </ul>
  
      <!-- Пагинация -->
      <div class="btn-group justify-center mt-4">
        <button class="btn" :disabled="currentPage === 1" @click="currentPage--">{{ $t('prev') }}</button>
        <span class="btn">{{ currentPage }} / {{ totalPages }}</span>
        <button class="btn" :disabled="currentPage === totalPages" @click="currentPage++">{{ $t('next') }}</button>
      </div>
  
      <!-- Модальное окно для добавления или редактирования поста -->
      <div v-if="showModal" class="modal modal-open">
        <div class="modal-box">
          <h3 class="font-bold text-lg">{{ isEditMode ? $t('editPost') : $t('addPost') }}</h3>
          <form @submit.prevent="submitPost">
            <div class="form-control mb-4">
              <label class="label">{{ $t('postTitle') }}</label>
              <input 
                v-model="newPost.title" 
                type="text" 
                :placeholder="$t('postTitleInp')" 
                class="input input-bordered" 
                required 
              />
            </div>
  
            <div class="form-control mb-4">
              <label class="label">{{ $t('body') }}</label>
              <textarea 
                v-model="newPost.body" 
                :placeholder="$t('postContent')" 
                class="textarea textarea-bordered" 
                required>
              </textarea>
            </div>
  
            <div class="modal-action">
              <button type="submit" class="btn btn-primary">{{ $t('Save') }}</button>
              <button type="button" @click="closeModal" class="btn">{{ $t('Cancel') }}</button>
            </div>
          </form>
        </div>
        <div v-if="error" role="alert" class="alert alert-error w-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </template>

  <script>
import { ref, computed, onMounted } from 'vue';
import { PostController } from '../controllers/PostController';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    const posts = ref([]);
    const showModal = ref(false);
    const newPost = ref({ title: '', body: '' });
    const currentPage = ref(1);
    const postsPerPage = 10;
    const isEditMode = ref(false);
    const isLoading = ref(false);
    const error = ref(null);

    const totalPages = computed(() => Math.ceil(posts.value.length / postsPerPage));

    const paginatedPosts = computed(() => {
      const start = (currentPage.value - 1) * postsPerPage;
      return posts.value.slice(start, start + postsPerPage);
    });

    const openModal = () => {
      showModal.value = true;
      error.value = null;
    };

    const closeModal = () => {
      showModal.value = false;
      newPost.value = { title: '', body: '' };
      isEditMode.value = false; 
      error.value = null;
    };

    const submitPost = async () => {
      try {
        const postData = {
          ...newPost.value,
          id: isEditMode.value ? newPost.value.id : Date.now(),
          userId: newPost.value.userId || 1,
        };

        if (isEditMode.value) {
          const updatedPost = await PostController.updatePost(postData);
          const index = posts.value.findIndex(post => post.id === updatedPost.id);
          if (index !== -1) {
            posts.value[index] = updatedPost;
          }
        } else {
          const createdPost = { ...postData };
          posts.value.unshift(createdPost);
        }

        closeModal();
      } catch (err) {
        console.error(
          isEditMode.value ? 'Error updating post in component:' : 'Error adding post in component:',
          err
        );
        error.value = isEditMode.value ? t('error.updatePost') : t('error.addPost');
      }
    };

    const editPost = (post) => {
      newPost.value = { userId: post.userId, title: post.title, body: post.body, id: post.id };
      isEditMode.value = true; 
      openModal();
    };

    const deletePost = async (postId) => {
      isLoading.value = true;
      try {
        await PostController.deletePost(postId); 
        posts.value = posts.value.filter(post => post.id !== postId);
      } catch (error) {
        console.error('Error deleting post in component:', error);
        error.value = t('error.deletePost');
      }  finally {
        isLoading.value = false;
      }
    };

    const fetchPosts = async () => {
      isLoading.value = true;
      try {
        posts.value = await PostController.fetchPosts();
      } catch (error) {
        console.error('Error loading posts in component:', error);
        error.value = t('error.loadPosts');
      }  finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchPosts);

    return {
      posts,
      paginatedPosts,
      showModal,
      newPost,
      openModal,
      closeModal,
      submitPost,
      editPost,
      deletePost,
      currentPage,
      totalPages,
      isEditMode,
      error,
      isLoading,
    };
  },
};
</script>