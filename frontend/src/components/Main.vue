<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <li>
      <MainAccountListItem
        v-for="account in $store.state.accounts"
        v-if="account.enabled"
        v-bind:item="account"
        v-bind:key="account.id"
      >
      </MainAccountListItem>
    </li>
    <button @click="openManageAccounts">Manage Accounts</button>
  </div>
</template>

<script>
import MainAccountListItem from '@/components/MainAccountListItem';

export default {
  name: 'Main',
  components: {
    MainAccountListItem
  },
  methods: {
    openManageAccounts: function () {
      this.$router.push('/accounts');
    }
  },
  beforeMount: function () {
    this.$store.dispatch('loadAccounts');
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

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

  button {
    width: 10rem;
  }
</style>
