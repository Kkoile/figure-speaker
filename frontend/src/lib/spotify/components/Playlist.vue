<template>
  <div>
    <h1>{{ $store.state.spotify.playlistName }}</h1>
    <div class="playlistOverview">
      <md-button class="md-primary md-raised" @click="saveItem">{{ $t("spotify.savePlaylist.button") }}</md-button>
      <h2>{{ $t("spotify.tracks.title") }}</h2>
      <div class="trackList">
        <PlaylistTrackItem
          v-for="item in $store.state.spotify.playlistTracks"
          v-bind:item="item.track"
          v-bind:key="item.track.uri">
        </PlaylistTrackItem>
      </div>
      <div class="loadMoreButton">
        <md-button v-if="$store.state.spotify.morePlaylistTracks" @click="loadMorePlaylistTracks">{{ $t("common.more.button") }}</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistTrackItem from './PlaylistTrackItem';

export default {
  id: 'Playlist',
  components: {
    PlaylistTrackItem
  },
  methods: {
    loadMorePlaylistTracks: function () {
      this.$store.dispatch('spotify/loadMorePlaylistTracks');
    },
    saveItem: function () {
      this.$store.dispatch('spotify/saveItem', this.$store.state.spotify.playlistUri);
    }
  },
  beforeMount: function () {
    this.$store.dispatch('spotify/loadPlaylist', this.$route.params.id);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .trackList {
    max-width: 100%;
    width: 30rem;
  }

  .playlistOverview {
    width: 100%;
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
