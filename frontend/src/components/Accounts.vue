<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <h2>Accounts</h2>
    <li>
      <AccountListItem
        v-for="account in $store.state.accounts"
        v-if="account.configurable"
        v-bind:item="account"
        v-bind:key="account.id">
      </AccountListItem>
    </li>
  </div>
</template>

<script>
  import AccountListItem from '@/components/AccountListItem'

  export default {
    name: 'Accounts',
    components: {
      AccountListItem
    },
    beforeMount: function () {
      this.$store.dispatch('loadAccounts')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
