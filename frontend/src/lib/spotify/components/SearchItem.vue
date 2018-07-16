<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="searchItem">
    <md-card>
      <md-card-media-cover md-solid>
        <md-card-media md-ratio="4:3">
          <img v-if="item.images && item.images.length > 0" :src="item.images[0].url">
        </md-card-media>
        <md-card-area>
          <md-card-header>
            <div class="md-title">{{ item.name }}</div>
          </md-card-header>

          <md-card-actions md-alignment="space-between">
            <md-button v-if="item.type==='track'" v-on:click="saveItem">{{ $t("common.save.button") }}</md-button>
            <md-button v-else v-on:click="openItem">{{ $t("common.open.button") }}</md-button>
          </md-card-actions>
        </md-card-area>
      </md-card-media-cover>
    </md-card>
  </div>
</template>

<style scoped>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
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
      } else {
        this.$router.push('/spotify/album/' + this.item.id);
      }
    },
    saveItem: function () {
      this.$store.dispatch('spotify/saveItem', this.item.uri);
    }
  }
};
</script>
