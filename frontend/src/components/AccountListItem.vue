<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <md-card-header>
      <div class="md-title">{{ item.name }} ({{ item.enabled ? $t("settings.accountActive.text") : $t("settings.accountInactive.text")}})</div>
    </md-card-header>

    <md-card-actions>
      <md-button @click="openManageAccount" class="md-primary">{{ $t("settings.manageAccount.button") }}</md-button>
    </md-card-actions>
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
