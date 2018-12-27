<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <form class="md-layout">
      <md-card>
        <md-card-header>
          <div class="md-title">{{ $t("spotify.manageAccount.title") }}</div>
          <div class="md-card-header-text" v-html="$t('spotify.credentials.text', {
            'url': mopidyUrl
            })"/>
        </md-card-header>

        <md-card-content>
          <md-field>
            <label for="username">{{ $t("spotify.userName.label") }}</label>
            <md-input name="username" id="username" v-model="$store.state.spotify.account.username" />
          </md-field>
          <md-field>
            <label for="password">{{ $t("spotify.password.label") }}</label>
            <md-input name="password" id="password" type="password" v-model="$store.state.spotify.account.password" />
          </md-field>
          <md-field>
            <label for="client_id">{{ $t("spotify.clientId.label") }}</label>
            <md-input name="client_id" id="client_id" v-model="$store.state.spotify.account.client_id" />
          </md-field>
          <md-field>
            <label for="client_secret">{{ $t("spotify.clientSecret.label") }}</label>
            <md-input name="client_secret" id="client_secret" type="password" v-model="$store.state.spotify.account.client_secret" />
          </md-field>
          <md-field>
            <md-select name="country" id="country" v-model="$store.state.spotify.account.country" options="$store.state.spotify.countryCodes">
              <md-option v-for="item in $store.state.spotify.countryCodes" v-bind:key="item.alpha2Code" :value="item.alpha2Code">{{ item.name }}</md-option>
            </md-select>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button @click="remove" class="md-secondary">{{ $t("common.delete.button") }}</md-button>
          <md-button @click="save" class="md-primary">{{ $t("common.save.button") }}</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SpotifyManageAccount',
  data: function () {
    return {
      mopidyUrl: 'https://www.mopidy.com/authenticate/',
      sending: false
    };
  },
  methods: {
    save: function () {
      this.sending = true;
      this.$store.dispatch('spotify/saveAccount').then(function () {
        this.sending = false;
      }.bind(this));
    },
    remove: function () {
      this.sending = true;
      this.$store.dispatch('spotify/deleteAccount').then(function () {
        this.sending = false;
      }.bind(this));
    }
  },
  beforeMount: function () {
    this.$store.dispatch('spotify/loadAccountInfo');
    this.$store.dispatch('spotify/loadCountryCodes');
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
