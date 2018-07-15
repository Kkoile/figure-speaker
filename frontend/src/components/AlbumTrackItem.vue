<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="listEntry">
    {{ item.name }}
    <button class="itemButton" v-on:click="saveItem">Save</button>
  </div>
</template>

<script>

export default {
  name: 'AlbumTrackItem',
  props: ['item'],
  methods: {
    saveItem: function () {
      this.$store.dispatch('saveItem', this.item.uri);
    }
  }
};
</script>

<style scoped>
  .listEntry {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .itemButton {
    margin: 4px;
  }
</style>
