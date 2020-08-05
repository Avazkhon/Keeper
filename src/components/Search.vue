<template>
  <div class="search">
    <h3>{{getText()}}</h3>
    <input
      class="search-input"
      type="text"
      placeholder="Search"
      v-on:keyup.enter="keyUpEnter"
      v-model="word"
    >

    <div class="options" v-if="getOptions.length">
      <strong>options</strong>
      <div
        class="options-item"
        v-for="(option) in getOptions.slice(0, 5)"
        :key="option"
      >
        <span v-on:click="getWordsByOption" :data-option="option">{{option}}</span>
      </div>
    </div>

    <div class="filters">
      <div class="filters-items" v-for="filter in filters" :key="filter.fl">
        <input
          type="checkbox"
          v-on:change="handleSelectfilter"
          :value="filter.fl"
          v-model="fl"
        >
        <strong>{{filter.fl}}</strong>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'Search',
  data() {
    return {
      word: this.$route.query.search || '',
      fl: [],
    };
  },

  created() {
    this.search();
  },

  watch: {
    $route: 'search',
  },

  computed: {
    ...mapGetters(['getOptions']),
    filters() {
      const filters = this.getWords().reduce((acc, a) => {
        const isHave = acc.some((el) => el.fl === a.fl);
        if (isHave) {
          return acc;
        }
        const newAcc = [...acc, a];
        return newAcc;
      }, [])
        .map((el) => ({ fl: el.fl }));
      return filters;
    },

    getQueryFl() {
      const fl = this.$route.query.fl || [];
      return Array.isArray(fl) ? fl : [fl];
    },
  },

  methods: {
    ...mapActions(['fetchWord']),
    ...mapMutations(['getwordByPartfromStarred', 'cleareStore']),
    ...mapGetters(['getWords']),

    keyUpEnter() {
      if (this.word.length) {
        this.search();
      } else {
        const query = this.$route.query || {};
        this.$router.push(
          {
            query: { ...query, search: '' },
          },
        )
          .catch(() => {});
      }
    },

    handleSelectfilter(event) {
      const fl = event.target.value;
      const query = this.$route.query || {};
      if (this.getQueryFl.some((flQery) => flQery === fl)) {
        this.$router.push(
          {
            query: { ...query, fl: this.getQueryFl.filter((flQery) => flQery !== fl) },
          },
        );
        return;
      }
      this.$router.push(
        {
          query: { ...query, fl: [...this.getQueryFl, fl] },
        },
      )
        .catch(() => {});
    },

    changeQSearch() {
      const query = this.$route.query || {};
      this.$router.push(
        {
          query: { ...query, search: this.word || this.$route.query.search },
        },
      )
        .catch(() => {});
    },

    search() {
      this.changeQSearch();
      const { fl } = this.$route.query;
      this.fl = Array.isArray(fl) ? fl : [fl];
      if (this.$route.query.q === 'starred-word') {
        this.getwordByPartfromStarred(this.word);
      } else if (this.word.length) {
        this.fetchWord(this.word);
      }
    },

    getText() {
      const { q } = this.$route.query;
      return q === 'starred-word' ? 'Starred-word' : 'Home';
    },

    getWordsByOption(event) {
      const word = event.target.getAttribute('data-option');
      this.word = word;
      this.changeQSearch();
      this.cleareStore();
      this.fetchWord(word);
    },
  },
  components: {
  },
};
</script>

<style media="screen">
  .search {
    background: #F0F8FF;
    margin: 5px;
    padding: 10px;
  }

  .filters {
    padding-top: 10px;
  }

  .search-input {
    width: 93%;
    padding: 5px;
  }

  .options {
    margin-top: 10px;
  }
  .options-item {
    padding-top: 5px;
  }

  .options-item :hover {
    cursor: pointer;
    opacity: .7;
  }
</style>
