<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <md-field>
      <md-input v-model="$store.state.youtube.query" v-bind:placeholder="$t('youtube.url.placeholder')" v-on:keyup.enter="save"></md-input>
      <md-button @click="save">{{ $t("common.save.button") }}</md-button>
    </md-field>
  </div>
</template>

<script>

export default {
  name: 'Youtube',
  methods: {
    save: function () {
      this.$store.dispatch('youtube/saveItem', this.$store.state.youtube.query);
    }
  }
};
</script>
