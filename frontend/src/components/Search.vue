<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <div>
      <input v-model="query">
      <button v-on:click="search">Search</button>
    </div>
    <li class="searchResult">
      <SearchItem
        v-for="artist in artists"
        v-bind:item="artist"
        v-bind:key="artist.uri">
      </SearchItem>
    </li>
    <li class="searchResult">
      <SearchItem
        v-for="album in albums"
        v-bind:item="album"
        v-bind:key="album.uri">
      </SearchItem>
    </li>
    <li class="searchResult">
      <SearchItem
        v-for="track in tracks"
        v-bind:item="track"
        v-bind:key="track.uri">
      </SearchItem>
    </li>
  </div>
</template>

<script>
  import Spotify from '@/lib/Spotify'
  import SearchItem from '@/components/SearchItem'

  export default {
    name: 'Search',
    data () {
      return {
        query: '',
        artists: [],
        albums: [],
        tracks: []
      }
    },
    components: {
      SearchItem
    },
    methods: {
      search: function () {
        Spotify.search(this.query)
          .then(function (oData) {
            this.artists = oData.data.artists.items;
            this.albums = oData.data.albums.items;
            this.tracks = oData.data.tracks.items;
          }.bind(this))
          .catch(function (err) {
            alert(err);
          });
      }
    }
  }
</script>

<style scoped>
  .searchResult {
    display: flex;
    flex-direction: row;
  }
</style>
