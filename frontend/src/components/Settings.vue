<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="main">
    <form class="md-layout">
      <md-card>
        <md-card-header>
          <div class="md-title">{{ $t("settings.language.title") }}</div>
        </md-card-header>

        <md-card-content>
          <md-field>
            <md-select name="language" id="language" v-model="$store.state.settings.language">
              <md-option v-for="language in $store.state.settings.availableLanguages" v-bind:value="language.id" v-bind:key="language.id">{{ $t(language.text) }}</md-option>
            </md-select>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button @click="saveLanguage" class="md-primary">{{ $t("common.save.button") }}</md-button>
        </md-card-actions>
      </md-card>

      <md-card>
        <md-card-header>
          <div class="md-title">{{ $t("settings.maxVolume.title") }}</div>
        </md-card-header>

        <md-card-content>
          <md-field>
            <md-input v-model="$store.state.settings.maxVolume" type="number" min="0" max="100"></md-input>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button @click="saveMaxVolume" class="md-primary">{{ $t("common.save.button") }}</md-button>
        </md-card-actions>
      </md-card>

      <md-card>
        <md-card-header>
          <div class="md-title">{{ $t("settings.playMode.title") }}</div>
        </md-card-header>

        <md-card-content>
          <md-field>
            <md-select name="playMode" id="playMode" v-model="$store.state.settings.playMode">
              <md-option value="RESUME">{{ $t("settings.resume.text") }}</md-option>
              <md-option value="RESET">{{ $t("settings.reset.text") }}</md-option>
            </md-select>
          </md-field>
          <md-field v-if="$store.state.settings.playMode === 'RESUME'">
            <label for="resumeAfter">{{ $t("settings.resumeAfter.label") }}</label>
            <md-input name="resumeAfter" id="resumeAfter" type="number" v-model="$store.state.settings.resetAfterDays" />
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button @click="savePlayMode" class="md-primary">{{ $t("common.save.button") }}</md-button>
        </md-card-actions>
      </md-card>

      <md-card>
        <md-card-header>
          <div class="md-title">{{ $t("settings.repeatMode.title") }}</div>
        </md-card-header>

        <md-card-content>
          <md-field>
            <label for="repeatMode">{{ $t("settings.repeatMode.label") }}</label>
            <md-checkbox name="repeatMode" id="repeatMode" v-model="$store.state.settings.repeatMode"></md-checkbox>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button @click="saveRepeatMode" class="md-primary">{{ $t("common.save.button") }}</md-button>
        </md-card-actions>
      </md-card>

      <md-card v-for="account in $store.state.settings.accounts"
               v-if="account.configurable"
               v-bind:key="account.id">
        <AccountListItem v-bind:item="account"></AccountListItem>
      </md-card>

      <md-card>
        <div v-if="!!$store.state.settings.updateAvailable">
          <md-badge md-content="1"/>
        </div>
        <md-card-header>
          <div class="md-title">{{ $t("settings.updates.title") }}</div>
        </md-card-header>

        <md-card-content>
          <md-field>
            <label for="currentVersion">{{ $t("settings.currentVersion.label") }}</label>
            <md-input name="currentVersion" id="currentVersion" disabled="true" v-model="$store.state.settings.currentVersion" />
          </md-field>
          <md-field>
            <label for="latestVersion">{{ $t("settings.latestVersion.label") }}</label>
            <md-input name="latestVersion" id="latestVersion" disabled="true" v-model="$store.state.settings.latestVersion" />
          </md-field>
          <div class="md-list-item-text" v-if="!$store.state.settings.updateAvailable">{{ $t("settings.noUpdateAvailable.label") }}</div>
        </md-card-content>

        <md-card-actions>
          <md-button @click="installUpdate" v-bind:disabled="!$store.state.settings.updateAvailable" class="md-primary">{{ $t("settings.installUpdate.button") }}</md-button>
        </md-card-actions>
      </md-card>
    </form>
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
    saveRepeatMode: function () {
      this.$store.dispatch('saveRepeatMode', this.$store.state.settings.repeatMode);
    },
    saveLanguage: function () {
      this.$store.dispatch('saveLanguage', this.$store.state.settings.language);
    },
    saveMaxVolume: function () {
      this.$store.dispatch('saveMaxVolume', this.$store.state.settings.maxVolume);
    },
    installUpdate: function () {
      window.location.href = 'http://' + window.location.hostname + ':3001';
    }
  },
  beforeMount: function () {
    this.$store.dispatch('loadAccounts');
    this.$store.dispatch('loadPlayMode');
    this.$store.dispatch('loadRepeatMode');
    this.$store.dispatch('loadMaxVolume');
  }
};
</script>
