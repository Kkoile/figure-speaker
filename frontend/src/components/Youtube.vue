<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <h1>Youtube</h1>
    <div>
      <input v-model="$store.state.query" placeholder="URL">
      <button @click="save">Save</button>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Youtube',
    methods: {
      save: function () {
        this.$store.dispatch('saveItem', 'yt:' + this.$store.state.query);
      }
    }
  }
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
