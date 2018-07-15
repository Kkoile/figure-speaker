<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <h2>{{ $t("spotify.manageAccount.title") }}</h2>
    <div>
      <li>
        <ul>
          <div>
            {{ $t("spotify.userName.label") }}: <input v-model="$store.state.spotify.account.username">
          </div>
          <div>
            {{ $t("spotify.password.label") }}: <input v-model="$store.state.spotify.account.password" :type="password">
          </div>
          <div>
            {{ $t("spotify.clientId.label") }}: <input v-model="$store.state.spotify.account.client_id">
          </div>
          <div>
            {{ $t("spotify.clientSecret.label") }}: <input v-model="$store.state.spotify.account.client_secret" :type="password">
          </div>
        </ul>
      </li>
      <div class="buttonArea">
        <button @click="save">{{ $t("common.save.button") }}</button>
        <button @click="remove">{{ $t("common.delete.button") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpotifyManageAccount',
  methods: {
    save: function () {
      this.$store.dispatch('spotify/saveAccount');
    },
    remove: function () {
      this.$store.dispatch('spotify/deleteAccount');
    }
  },
  beforeMount: function () {
    this.$store.dispatch('spotify/loadAccountInfo');
  }
};
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
