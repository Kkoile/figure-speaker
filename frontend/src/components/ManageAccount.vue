<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <h2>Manage Account of {{$store.state.account.name}}</h2>
    <div v-if="$store.state.account.requiredInfo.length > 0">
      <li>
        <ul
          v-for="property in $store.state.account.requiredInfo"
          v-bind:item="property"
          v-bind:key="property.key">
          <div>
            {{property.name}}: <input v-model="$store.state.account[property.key]"
                                      :type="!!property.password ? 'password' : ''">
          </div>
        </ul>
      </li>
      <div class="buttonArea">
        <button @click="save">Save</button>
        <button @click="remove">Delete</button>
      </div>
    </div>
    <div v-else class="main">
      No configuration needed for this account.
      <button v-if="$store.state.account.enabled" @click="remove">Disable</button>
      <button v-else @click="save">Enable</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ManageAccount',
    methods: {
      save: function () {
        this.$store.dispatch('saveAccount', this.$store.state.account)
      },
      remove: function () {
        this.$store.dispatch('deleteAccount', this.$store.state.account.id)
      }
    },
    beforeMount: function () {
      this.$store.dispatch('loadAccountInfo', this.$route.params.hostId)
    }
  }
</script>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .buttonArea {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    width: 5rem;
  }
</style>
