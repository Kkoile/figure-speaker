<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="searchItem">
    <img v-if="item.images && item.images.length > 0" class="albumCover" :src="item.images[0].url"/>
    <div class="titleCover" v-else>
      {{ item.name }}
    </div>
    <button v-if="item.type==='artist'" class="itemButton" v-on:click="openArtist">Open</button>
    <button v-else class="itemButton" v-on:click="saveItem">Save</button>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'SearchItem',
    props: ['item'],
    methods: {
      openArtist: function () {
        this.$router.push('/artist/' + this.item.id);
      },
      saveItem: function () {
        axios.post('http://localhost:3001/settings/saveFigure', {streamUri: this.item.uri})
          .then(function () {
            alert('success')
          })
          .catch(function (err) {
            alert(JSON.stringify(err.response.data));
          });
      }
    }
  }
</script>

<style scoped>
  .searchItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
  }

  .itemButton {
    margin: 4px;
  }

  .albumCover {
    width: 100px;
    height: 100px;
  }

  .titleCover {
    width: 100px;
    height: 100px;
    background-color: aquamarine;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
