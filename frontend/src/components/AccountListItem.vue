<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="listItem">
    {{ item.name }}
    enabled: {{ item.enabled }}
    <button @click="openManageAccount">Manage Account</button>
  </div>
</template>

<script>
  export default {
    name: 'AccountListItem',
    props: ['item'],
    methods: {
      openManageAccount: function () {
        this.$router.push('/accounts/' + this.item.id);
      }
    }
  }
</script>

<style scoped>
  .listItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 5px;
  }
</style>
