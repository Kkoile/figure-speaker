<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <h1>{{ $t("youtube.title.title") }}</h1>
    <div>
      <input v-model="$store.state.youtube.query" v-bind:placeholder="$t('youtube.url.placeholder')" v-on:keyup.enter="save">
      <button @click="save">{{ $t("common.save.button") }}</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Youtube',
  methods: {
    save: function () {
      this.$store.dispatch('youtube/saveItem', this.$store.state.youtube.query);
    }
  }
};
</script>

<style scoped>
  .searchResult {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .searchList {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    width: 100%;
  }

  .loadMoreButton {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
