<template>
  <div class="header">
    <router-link class="logo" to="/">
      Word-keeper
    </router-link>
    <router-link class="starred-word" :to="getQparams">
      starred-word
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Header',
  computed: {
    getQparams() {
      const { q } = this.$route.query;
      return q === 'starred-word' ? '/' : '?q=starred-word';
    },
  },
  components: {
  },
};
</script>

<style media="screen">
  .header {
    border-radius: 5px;
    background: blue;
    width: 95%;
    margin: 10px auto;
    height: 40px;
    display: grid;
    grid-template-columns: 85% 15%;
  }

  .logo {
    color: #FFFFFF;
    text-decoration: none;
    margin: 10px 0 0 10px;
  }

  .starred-word {
    color: #FFFFFF;
    text-decoration: none;
    margin: 10px 10px 0 0;
  }
</style>
