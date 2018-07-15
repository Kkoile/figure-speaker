<template>
  <div>
    <h1>Artist: {{ $store.state.spotify.artistName }}</h1>
    <div class="searchResult">
      <h2>{{ $t("spotify.topTracks.title") }}</h2>
      <li class="searchList">
        <SearchItem
          v-for="track in $store.state.spotify.artistTracks"
          v-bind:item="track"
          v-bind:key="track.uri">
        </SearchItem>
      </li>
      <h2>{{ $t("spotify.albums.title") }}</h2>
      <li class="searchList">
        <SearchItem
          v-for="album in $store.state.spotify.artistAlbums"
          v-bind:item="album"
          v-bind:key="album.uri">
        </SearchItem>
        <div class="loadMoreButton">
          <button v-if="$store.state.spotify.moreArtistAlbums" @click="loadMoreArtistAlbums">{{ $t("common.more.button") }}</button>
        </div>
      </li>
    </div>
  </div>
</template>

<script>
import SearchItem from './SearchItem';
import {mapActions} from 'vuex';

export default {
  id: 'Artist',
  components: {
    SearchItem
  },
  methods: mapActions('spotify/', [
    'loadMoreArtistAlbums'
  ]),
  beforeMount: function () {
    this.$store.dispatch('spotify/loadArtist', this.$route.params.id);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .searchResult {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .searchList {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    width: 100%;
  }

  .loadMoreButton {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
