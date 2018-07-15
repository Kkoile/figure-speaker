<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <div class="section">
      <h2>{{ $t("settings.language.title") }}</h2>
      <select v-model="$store.state.settings.language">
        <option v-for="language in $store.state.settings.availableLanguages" v-bind:value="language.id" v-bind:key="language.id">{{ $t(language.text) }}</option>
      </select>
      <button @click="saveLanguage">{{ $t("common.save.button") }}</button>
    </div>
    <div class="section">
      <h2>{{ $t("settings.playMode.title") }}</h2>
      <select v-model="$store.state.settings.playMode">
        <option value="RESUME">{{ $t("settings.resume.text") }}</option>
        <option value="RESET">{{ $t("settings.reset.text") }}</option>
      </select>
      <div v-if="$store.state.settings.playMode === 'RESUME'">
        {{ $t("settings.resumeAfter.label") }}: <input v-model="$store.state.settings.resetAfterDays"
                                       type="number">
      </div>
      <button @click="savePlayMode">{{ $t("common.save.button") }}</button>
    </div>
    <div class="section">
      <h2>{{ $t("settings.accounts.title") }}</h2>
      <li>
        <AccountListItem
          v-for="account in $store.state.settings.accounts"
          v-if="account.configurable"
          v-bind:item="account"
          v-bind:key="account.id">
        </AccountListItem>
      </li>
    </div>
  </div>
</template>

<script>
import AccountListItem from '@/components/AccountListItem';

export default {
  name: 'Settings',
  components: {
    AccountListItem
  },
  methods: {
    savePlayMode: function () {
      this.$store.dispatch('savePlayMode', {
        playMode: this.$store.state.settings.playMode,
        resetAfterDays: this.$store.state.settings.resetAfterDays
      });
    },
    saveLanguage: function () {
      this.$store.dispatch('saveLanguage', this.$store.state.settings.language);
    }
  },
  beforeMount: function () {
    this.$store.dispatch('loadAccounts');
    this.$store.dispatch('loadPlayMode');
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
