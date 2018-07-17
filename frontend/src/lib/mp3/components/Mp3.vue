<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <md-field>
      <md-input v-model="$store.state.mp3.query" v-bind:placeholder="$t('mp3.url.placeholder')" v-on:keyup.enter="save"></md-input>
      <md-button @click="save">{{ $t("common.save.button") }}</md-button>
    </md-field>
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
