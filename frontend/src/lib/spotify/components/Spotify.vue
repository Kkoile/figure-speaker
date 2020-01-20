<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <md-field>
      <md-input v-model="$store.state.spotify.query" v-on:keyup.enter="search"></md-input>
      <md-button @click="search" class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>
    </md-field>
    <div class="searchResult">
      <h2>{{ $t("spotify.artists.title") }}</h2>
      <li class="searchList">
        <SearchItem
          v-for="artist in $store.state.spotify.artists"
          v-bind:item="artist"
          v-bind:key="artist.uri">
        </SearchItem>
        <div class="loadMoreButton">
          <md-button v-if="$store.state.spotify.moreArtists" @click="loadMoreArtists">{{ $t("common.more.button") }}</md-button>
        </div>
      </li>
      <div v-if="$store.state.spotify.artists.length === 0">
        {{ $t("common.noData.text") }}
      </div>
    </div>
    <div class="searchResult">
      <h2>{{ $t("spotify.albums.title") }}</h2>
      <li class="searchList">
        <SearchItem
          v-for="album in $store.state.spotify.albums"
          v-bind:item="album"
          v-bind:key="album.uri">
        </SearchItem>
        <div class="loadMoreButton">
          <md-button v-if="$store.state.spotify.moreAlbums" @click="loadMoreAlbums">{{ $t("common.more.button") }}</md-button>
        </div>
      </li>
      <div v-if="$store.state.spotify.albums.length === 0">
        {{ $t("common.noData.text") }}
      </div>
    </div>
    <div class="searchResult">
      <h2>{{ $t("spotify.tracks.title") }}</h2>
      <li class="searchList">
        <SearchItem
          v-for="track in $store.state.spotify.tracks"
          v-bind:item="track"
          v-bind:key="track.uri">
        </SearchItem>
        <div class="loadMoreButton">
          <md-button v-if="$store.state.spotify.moreTracks" @click="loadMoreTracks">{{ $t("common.more.button") }}</md-button>
        </div>
      </li>
      <div v-if="$store.state.spotify.tracks.length === 0">
        {{ $t("common.noData.text") }}
      </div>
    </div>
  </div>
</template>

<script>
import SearchItem from './SearchItem';
import { mapActions } from 'vuex';

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
  ]),
  beforeMount: function () {
    this.$store.dispatch('spotify/loadAccountInfo');
  }
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
