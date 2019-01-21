<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="searchItem">
    <md-card>
      <md-card-media-cover md-solid>
        <md-card-media md-ratio="4:3">
          <img v-if="item.images && item.images.length > 0" :src="item.images[0].url">
          <div class="placeholder-background" v-else ></div>
        </md-card-media>
        <md-card-area>
          <md-card-header>
            <div class="md-title">{{ item.name }}</div>
          </md-card-header>

          <md-card-actions md-alignment="flex-start">
            <md-button v-if="item.type==='track'" v-on:click="saveItem">{{ $t("common.save.button") }}</md-button>
            <md-button v-else v-on:click="openItem">{{ $t("common.open.button") }}</md-button>
          </md-card-actions>
        </md-card-area>
      </md-card-media-cover>
    </md-card>
  </div>
</template>

<style scoped>
  .searchItem {
    max-width: calc(100% - 3rem);
    margin-right: 5px;
  }
  .md-card {
    max-width: 100%;
    width: 320px;
  }
  .md-card-header {
    padding: 0 1rem;
  }
  .md-title {
    font-size: 1rem;
  }
  .placeholder-background {
    width: 100%;
    height: 100%;
    background-color: #448aff;
    position: absolute;
    top: 0;
    left: 0;

  }
</style>

<script>
export default {
  name: 'SearchItem',
  props: ['item'],
  methods: {
    openItem: function () {
      if (this.item.type === 'artist') {
        this.$router.push('/spotify/artist/' + this.item.id);
      } else if (this.item.type === 'album') {
        this.$router.push('/spotify/album/' + this.item.id);
      } else if (this.item.type === 'playlist') {
        this.$router.push('/spotify/playlist/' + this.item.id);
      }
    },
    saveItem: function () {
      this.$store.dispatch('spotify/saveItem', this.item.uri);
    }
  }
};
</script>
