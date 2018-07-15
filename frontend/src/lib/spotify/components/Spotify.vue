<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <h1>Spotify</h1>
    <div>
      <input v-model="$store.state.spotify.query" v-on:keyup.enter="search">
      <button @click="search">Search</button>
    </div>
    <div class="searchResult">
      <h2>Artists</h2>
      <li class="searchList">
        <SearchItem
          v-for="artist in $store.state.spotify.artists"
          v-bind:item="artist"
          v-bind:key="artist.uri">
        </SearchItem>
        <div class="loadMoreButton">
          <button v-if="$store.state.spotify.moreArtists" @click="loadMoreArtists">More</button>
        </div>
      </li>
      <div v-if="$store.state.spotify.artists.length === 0">
          No Data
      </div>
    </div>
    <div class="searchResult">
      <h2>Albums</h2>
      <li class="searchList">
        <SearchItem
          v-for="album in $store.state.spotify.albums"
          v-bind:item="album"
          v-bind:key="album.uri">
        </SearchItem>
        <div class="loadMoreButton">
          <button v-if="$store.state.spotify.moreAlbums" @click="loadMoreAlbums">More</button>
        </div>
      </li>
      <div v-if="$store.state.spotify.albums.length === 0">
          No Data
      </div>
    </div>
    <div class="searchResult">
      <h2>Tracks</h2>
      <li class="searchList">
        <SearchItem
          v-for="track in $store.state.spotify.tracks"
          v-bind:item="track"
          v-bind:key="track.uri">
        </SearchItem>
        <div class="loadMoreButton">
          <button v-if="$store.state.spotify.moreTracks" @click="loadMoreTracks">More</button>
        </div>
      </li>
      <div v-if="$store.state.spotify.tracks.length === 0">
          No Data
      </div>
    </div>
  </div>
</template>

<script>
import SearchItem from './SearchItem';
import {mapActions} from 'vuex';

export default {
  name: 'Spotify',
  components: {
    SearchItem
  },
  methods: mapActions('spotify/', [
    'search',
    'loadMoreArtists',
    'loadMoreAlbums',
    'loadMoreTracks'
  ])
};
</script>

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
