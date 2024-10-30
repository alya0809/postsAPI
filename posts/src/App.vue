<template>
  <div id="app" class="min-h-screen">
    <MyHeader />
    <PostList />
  </div>
</template>

<script>
import PostList from './view/PostList.vue';
import MyHeader from './components/MyHeader.vue';
export default {
  name: 'App',
  components: { PostList, MyHeader },
};
</script>
