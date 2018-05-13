<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <div class="section">
      <h2>Play Mode</h2>
      <select v-model="$store.state.playMode">
        <option value="RESUME">Resume</option>
        <option value="RESET">Reset</option>
      </select>
      <div v-if="$store.state.playMode === 'RESUME'">
        Reset state after days: <input v-model="$store.state.resetAfterDays"
                                       type="number">
      </div>
      <button @click="savePlayMode">Save Play Mode</button>
    </div>
    <div class="section">
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
  </div>
</template>

<script>
  import AccountListItem from '@/components/AccountListItem'

  export default {
    name: 'Accounts',
    components: {
      AccountListItem
    },
    methods: {
      savePlayMode: function () {
        this.$store.dispatch('savePlayMode', {
          playMode: this.$store.state.playMode,
          resetAfterDays: this.$store.state.resetAfterDays
        })
      }
    },
    beforeMount: function () {
      this.$store.dispatch('loadAccounts');
      this.$store.dispatch('loadPlayMode');
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .section {
    display: flex;
    flex-direction: column;
    width: 20rem;
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
</style>
