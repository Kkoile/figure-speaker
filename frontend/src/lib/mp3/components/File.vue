<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <md-list-item>
    <div class="md-list-item-text">{{ item }}</div>
    <md-button v-on:click="saveItem">{{ $t("common.save.button") }}</md-button>
  </md-list-item>
</template>

<script>
export default {
  name: 'File',
  props: ['item'],
  methods: {
    saveItem: function () {
      this.$store.dispatch('mp3/saveItem', 'local:track:' + this.item);
    }
  }
};
</script>
