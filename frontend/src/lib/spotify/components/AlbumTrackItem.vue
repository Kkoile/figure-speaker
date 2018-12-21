<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="listEntry">
    {{ item.name }}
    <md-button class="itemButton" v-on:click="saveItem">{{ $t("common.save.button") }}</md-button>
  </div>
</template>

<script>

export default {
  name: 'AlbumTrackItem',
  props: ['item'],
  methods: {
    saveItem: function () {
      this.$store.dispatch('spotify/saveItem', this.item.uri);
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
    border-bottom: 1px solid #ccc;
    padding: 5px 0;
  }

  .itemButton {
    margin: 4px;
  }
</style>
