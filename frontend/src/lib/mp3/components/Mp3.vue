<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <h1>MP3</h1>
    <div>
      <input v-model="$store.state.mp3.query" placeholder="MP3 URL" v-on:keyup.enter="save">
      <button @click="save">Save</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Mp3',
  methods: {
    save: function () {
      this.$store.dispatch('mp3/saveItem', this.$store.state.mp3.query);
    }
  }
};
</script>
