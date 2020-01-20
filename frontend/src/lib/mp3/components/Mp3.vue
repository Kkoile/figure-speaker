<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <div class="md-title">{{ $t("mp3.list.title") }}</div>
    <md-empty-state
      v-if="$store.state.mp3.files.length === 0"
      md-icon="play_circle_outline"
    >
      <div class="md-empty-state-label">{{ $t("mp3.noData.text") }}</div>
      <md-button class="md-primary md-raised" v-on:click="openFileChoser()">{{ $t("mp3.uploadFirstFileNow.button") }}</md-button>
      <div v-if="!!file" class="md-list-item-text">{{ $t("mp3.fileName.label") }} {{ file.name }}</div>
      <md-button v-if="!!file" v-bind:disabled="!file" v-on:click="submitFile()">{{ $t("mp3.upload.button") }}</md-button>
    </md-empty-state>
    <md-list v-else>
      <File v-for="file in $store.state.mp3.files"
          v-bind:item="file"
          v-bind:key="file" />
    </md-list>

    <md-progress-bar md-mode="indeterminate" v-if="$store.state.mp3.uploadStatus === 'PENDING'" />

    <input class="invisible" type="file" visible="false" id="file" ref="file" v-on:change="handleFileUpload()"/>
    <div class="upload" v-if="$store.state.mp3.files.length > 0">
      <md-button class="md-raised" v-on:click="openFileChoser()">{{ $t("mp3.openFileChoser.button") }}</md-button>
      <div class="md-list-item-text">{{ file.name }}</div>
      <md-button v-bind:disabled="!file" v-on:click="submitFile()">{{ $t("mp3.upload.button") }}</md-button>
    </div>
  </div>
</template>

<style scoped>
  .md-list-item-text {
    flex: 0 1 auto;
    margin: 6px 8px;
    padding: 0 8px;
  }
  .upload {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .invisible {
    display: none;
  }
</style>

<script>

import File from './File';
export default {
  name: 'Mp3',
  components: {
    File
  },
  data () {
    return {
      file: ''
    };
  },
  methods: {
    submitFile () {
      this.$store.dispatch('mp3/upload', this.file);
    },

    openFileChoser () {
      this.$refs.file.click();
    },

    handleFileUpload () {
      this.file = this.$refs.file.files[0];
    }
  },
  beforeMount: function () {
    this.$store.dispatch('mp3/loadAvailable');
  }
};
</script>
