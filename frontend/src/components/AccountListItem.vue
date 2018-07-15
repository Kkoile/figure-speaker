<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="listItem">
    {{ item.name }}
    ({{ item.enabled ? $t("settings.accountActive.text") : $t("settings.accountInactive.text")}})
    <button @click="openManageAccount">{{ $t("settings.manageAccount.button") }}</button>
  </div>
</template>

<script>
export default {
  name: 'AccountListItem',
  props: ['item'],
  methods: {
    openManageAccount: function () {
      this.$router.push('/' + this.item.id + '/manageAccount');
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
