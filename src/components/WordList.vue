<template>
  <div class="word-list">
    <div
      class="word-items"
      v-for="word in words"
      :key="word.meta.uuid"
      :data-uuid="word.meta.uuid"
      v-on:click="handleShowItem"
    >
      <strong>{{word.meta.stems[0]}}</strong>
      <span class="fl">{{word.fl}}</span>
      <span
        class="shortdef"
        v-if="!(showItemUuid === word.meta.uuid)"
      >
        {{word.shortdef[0]}}
      </span>
      <span v-if="showItemUuid === word.meta.uuid"></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="13pt" height="13pt" viewBox="0 0 13 13" version="1.1">
        <g id="surface1">
        <path
          v-on:click="handleAddStarred"
          :data-uuid="word.meta.uuid"
          :data-isStarrted="word.isStarrted"
          v-bind:style="getStyleForSVG(word.isStarrted)"
          d="M 11.644531 1.578125 C 10.265625 0.402344 8.210938 0.613281 6.945312
          1.917969 L 6.449219 2.429688 L 5.953125 1.917969 C 4.6875 0.613281
          2.632812 0.402344 1.25 1.578125 C -0.328125 2.925781 -0.414062 5.351562
          1.003906 6.8125 L 5.875 11.847656 C 6.191406 12.171875 6.703125 12.171875
          7.019531 11.847656 L 11.890625 6.8125 C 13.308594 5.351562 13.226562
          2.925781 11.644531 1.578125 Z M 11.644531 1.578125 "
        />
        </g>
      </svg>
      <div v-if="showItemUuid === word.meta.uuid">
        <span><strong>stems</strong></span>
        <p v-for="stems in word.meta.stems" :key="stems">{{stems}}</p>
      </div>
      <div v-if="showItemUuid === word.meta.uuid">
        <span><strong>short def</strong></span>
        <p v-for="shortDef in word.shortdef" :key="shortDef">{{shortDef}}</p>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'wordList',
  data() {
    return {
      starred: JSON.parse(localStorage.getItem('starred')),
      showItemUuid: '',
    };
  },

  computed: {
    ...mapGetters(['getWords']),
    getQueryFl() {
      const fl = this.$route.query.fl || [];
      return Array.isArray(fl) ? fl : [fl];
    },
    words() {
      return this.getWords.filter((word) => {
        if (this.getQueryFl.length) {
          return this.getQueryFl.some((fl) => fl === word.fl);
        }
        return word;
      })
        .sort((a, b) => {
          const stemA = a.meta.stems[0].toUpperCase();
          const stemB = b.meta.stems[0].toUpperCase();
          if (stemA > stemB) {
            return 1;
          }
          if (stemA < stemB) {
            return -1;
          }
          return 0;
        });
    },
  },

  created() {
    this.checkQParamsAndFetch();
  },

  watch: {
    $route: 'checkQParamsAndFetch',
  },

  methods: {
    ...mapMutations(['addStarred', 'removeStarred', 'getStarredFromLocatiion', 'cleareStore']),
    handleAddStarred(event) {
      const uuid = event.target.getAttribute('data-uuid');
      const isStarrted = event.target.getAttribute('data-isStarrted');
      if (!isStarrted) {
        this.addStarred(uuid);
      } else {
        this.removeStarred(uuid);
      }
    },

    checkQParamsAndFetch() {
      if (this.$route.query.q === 'starred-word') {
        this.getStarredFromLocatiion();
      } else {
        this.cleareStore();
      }
    },
    getStyleForSVG(isStarrted) {
      const fill = isStarrted ? 'red' : '#FFFFFF';
      return {
        cursor: 'pointer',
        stroke: 'maroon',
        'fill-opacity': 1,
        'fill-rule': 'nonzero',
        fill,
      };
    },

    handleShowItem(event) {
      const showItemUuid = event.currentTarget.getAttribute('data-uuid');
      if (this.showItemUuid === showItemUuid) {
        this.showItemUuid = '';
      } else {
        this.showItemUuid = showItemUuid;
      }
    },
  },
  components: {
  },
};
</script>

<style media="screen">
  .word-list {
    max-width: 98%;
    margin-bottom: 20px;
  }

  .word-items {
    cursor: pointer;
    display: grid;
    grid-template-columns: auto auto 9fr auto;
    background: #FFFFFF;
    margin-top: 5px;
    padding: 7px;
    grid-gap: 20px;
  }

  .fl {
    font-family: 'Times New Roman', Times, sans-serif;
    font-style: italic;
  }

  .shortdef {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
