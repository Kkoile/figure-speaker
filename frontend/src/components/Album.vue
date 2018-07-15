<template>
  <div>
    <h1>{{ $store.state.albumArtistName }}</h1>
    <h2>{{ $store.state.albumName }}</h2>
    <div class="albumOverview">
      <button @click="saveItem">Save Album</button>
      <h2>Tracks</h2>
      <div class="trackList">
        <AlbumTrackItem
          v-for="track in $store.state.albumTracks"
          v-bind:item="track"
          v-bind:key="track.uri">
        </AlbumTrackItem>
      </div>
      <div class="loadMoreButton">
        <button v-if="$store.state.moreAlbumTracks" @click="loadMoreAlbumTracks">More</button>
      </div>
    </div>
  </div>
</template>

<script>
import AlbumTrackItem from '@/components/AlbumTrackItem';

export default {
  id: 'Album',
  components: {
    AlbumTrackItem
  },
  methods: {
    loadMoreAlbumTracks: function () {
      this.$store.dispatch('loadMoreAlbumTracks');
    },
    saveItem: function () {
      this.$store.dispatch('saveItem', this.$store.state.albumUri);
    }
  },
  beforeMount: function () {
    this.$store.dispatch('loadAlbum', this.$route.params.id);
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
