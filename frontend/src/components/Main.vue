<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <!-- eslint-disable vue/no-use-v-if-with-v-for -->
    <MainAccountListItem
      v-for="account in $store.state.settings.accounts"
      v-if="account.enabled"
      v-bind:item="account"
      v-bind:key="account.id"
    >
    </MainAccountListItem>
  </div>
</template>

<script>
import MainAccountListItem from '@/components/MainAccountListItem';

export default {
  name: 'Main',
  components: {
    MainAccountListItem
  },
  beforeMount: function () {
    this.$store.dispatch('loadAccounts');
  }
};
</script>
