<template>
  <div class="home">
    <Header/>
    <Search/>
    <WordList/>
  </div>
</template>

<script>

import Header from '@/components/Header.vue';
import Search from '@/components/Search.vue';
import WordList from '@/components/WordList.vue';

export default {
  name: 'Home',
  components: {
    Header,
    Search,
    WordList,
  },
};
</script>

<style scoped="true">
  .home {
    display: grid;
    grid-template-columns: 20% 80%;
    grid-template-areas:
      "header header"
      "search wordList"
      "search wordList";
    grid-gap: 15px;
    background: #add8e6;
  }

  .header {
    grid-area: header;
  }
  .search {
    grid-area: search;
  }
  .word-list {
    grid-area: wordList;
  }
</style>
