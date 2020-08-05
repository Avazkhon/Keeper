import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    words: [],
    options: [],
  },
  mutations: {
    updateWords(state, words) {
      state.words = words;
    },
    updateOptions(state, options) {
      state.options = options;
    },

    addStarred(state, uuid) {
      state.words = state.words.map((word) => {
        if (word.meta.uuid === uuid && !word.isStarrted) {
          let starred = JSON.parse(localStorage.getItem('starred'));
          starred = starred || [];
          const newWord = { ...word, isStarrted: true };
          localStorage.setItem('starred', JSON.stringify([...starred, newWord]));
          return newWord;
        }
        return word;
      });
    },
    removeStarred(state, uuid) {
      state.words = state.words.map((word) => {
        if (word.meta.uuid === uuid && word.isStarrted) {
          let starred = JSON.parse(localStorage.getItem('starred'));
          starred = starred || [];
          starred = starred.filter((el) => el.meta.uuid !== uuid);
          const newWord = { ...word, isStarrted: false };
          localStorage.setItem('starred', JSON.stringify(starred));
          return newWord;
        }
        return word;
      });
    },
    getStarredFromLocatiion(state) {
      let starred = JSON.parse(localStorage.getItem('starred'));
      starred = starred || [];
      state.words = starred;
    },

    getwordByPartfromStarred(state, part) {
      let starred = JSON.parse(localStorage.getItem('starred'));
      starred = starred || [];
      state.words = starred.filter((word) => {
        let isHave;
        if (!word.meta.id.indexOf(part)) {
          isHave = word.meta.id.indexOf(part);
        } else {
          isHave = word.shortdef[0].indexOf(part);
        }
        return isHave !== -1;
      });
    },

    cleareStore(state) {
      state.words = [];
      state.options = [];
    },
  },
  actions: {
    async fetchWord(stx, word) {
      const wors = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=b44955e9-5fb8-4be8-a720-7dea239e8f82`);
      const data = await wors.json();
      if (typeof data[0] === 'string') {
        stx.commit('updateOptions', data);
        return;
      }
      let starred = JSON.parse(localStorage.getItem('starred'));
      starred = starred || [];
      stx.commit('updateWords', data.map((el) => {
        if (starred && starred.find((star) => star.meta.uuid === el.meta.uuid)) {
          return { ...el, isStarrted: true };
        }
        return el;
      }));
    },
  },

  getters: {
    getWords(state) {
      return state.words;
    },
    getOptions(state) {
      return state.options;
    },
  },
  modules: {
  },
});
