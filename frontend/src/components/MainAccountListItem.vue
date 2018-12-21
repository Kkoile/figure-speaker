<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="listItem">
    <md-card>
      <md-card-header>
        <div class="md-title">{{ item.name }}</div>
      </md-card-header>
      <md-card-actions>
        <md-button v-on:click="openAccountPage">{{ $t("main.openAccount.button") }}</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'MainAccountListItem',
  props: ['item'],
  methods: {
    openAccountPage: function () {
      this.$router.push('/' + this.item.id);
    }
  }
};
</script>

<style scoped>
  .md-card {
    width: calc(100% - 2rem);
    max-width: 320px;
    display: inline-block;
    vertical-align: top;
  }
</style>
