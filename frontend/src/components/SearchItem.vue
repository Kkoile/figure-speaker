<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="searchItem">
    <img v-if="item.images && item.images.length > 0" class="albumCover" :src="item.images[0].url"/>
    <div class="titleCover" v-else>
      {{ item.name }}
    </div>
    <button v-if="item.type==='track'" class="itemButton" v-on:click="saveItem">Save</button>
    <button v-else class="itemButton" v-on:click="openItem">Open</button>
  </div>
</template>

<script>
  export default {
    name: 'SearchItem',
    props: ['item'],
    methods: {
      openItem: function () {
        if (this.item.type === 'artist') {
          this.$router.push('/artist/' + this.item.id);
        } else {
          this.$router.push('/album/' + this.item.id);
        }
      },
      saveItem: function () {
        this.$store.dispatch('saveItem', this.item.uri)
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
    width: 200px;
    height: 200px;
  }

  .titleCover {
    width: 200px;
    height: 200px;
    background-color: aquamarine;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: normal;
  }
</style>
