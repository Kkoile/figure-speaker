<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="listItem">
    {{ item.name }}
    <button @click="openAccountPage">{{ $t("main.openAccount.button") }}</button>
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
  .listItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 5px;
  }
</style>
