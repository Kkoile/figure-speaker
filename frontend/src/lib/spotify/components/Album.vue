<template>
  <div>
    <h1>{{ $store.state.spotify.albumArtistName }}</h1>
    <h2>{{ $store.state.spotify.albumName }}</h2>
    <div class="albumOverview">
      <md-button @click="saveItem">{{ $t("spotify.saveAlbum.button") }}</md-button>
      <h2>{{ $t("spotify.tracks.title") }}</h2>
      <div class="trackList">
        <AlbumTrackItem
          v-for="track in $store.state.spotify.albumTracks"
          v-bind:item="track"
          v-bind:key="track.uri">
        </AlbumTrackItem>
      </div>
      <div class="loadMoreButton">
        <md-button v-if="$store.state.spotify.moreAlbumTracks" @click="loadMoreAlbumTracks">{{ $t("common.more.button") }}</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import AlbumTrackItem from './AlbumTrackItem';

export default {
  id: 'Album',
  components: {
    AlbumTrackItem
  },
  methods: {
    loadMoreAlbumTracks: function () {
      this.$store.dispatch('spotify/loadMoreAlbumTracks');
    },
    saveItem: function () {
      this.$store.dispatch('spotify/saveItem', this.$store.state.spotify.albumUri);
    }
  },
  beforeMount: function () {
    this.$store.dispatch('spotify/loadAlbum', this.$route.params.id);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .trackList {
    width: 30rem;
  }

  .albumOverview {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .loadMoreButton {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
