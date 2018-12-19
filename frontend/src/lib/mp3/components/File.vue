<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <md-list-item>
    <md-dialog :md-active.sync="$store.state.mp3.showFileIsInUseDialog">
      <md-dialog-title>{{ $t("mp3.deleteFileInUse.text") }}</md-dialog-title>

      <md-dialog-actions>
        <md-button class="md-primary" v-on:click="cancelDeleteFile">{{ $t("common.cancel.button") }}</md-button>
        <md-button class="md-primary" v-on:click="deleteFile">{{ $t("common.delete.button") }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <div class="md-list-item-text">{{ item }}</div>
    <md-button v-on:click="saveItem">{{ $t("common.save.button") }}</md-button>
    <md-button v-on:click="checkAndDeleteFile">{{ $t("common.delete.button") }}</md-button>
  </md-list-item>
</template>

<script>
export default {
  name: 'File',
  props: ['item'],
  methods: {
    saveItem: function () {
      this.$store.dispatch('mp3/saveItem', 'local:track:' + this.item);
    },
    checkAndDeleteFile: function () {
      this.$store.dispatch('mp3/checkIfFileIsInUse', this.item);
    },
    cancelDeleteFile: function () {
      this.$store.dispatch('mp3/cancelDeleteFile');
    },
    deleteFile: function () {
      this.$store.dispatch('mp3/deleteFile', this.$store.state.mp3.itemToDelete);
    }
  }
};
</script>
