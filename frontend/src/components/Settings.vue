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
    </form>
  </div>

    <!--<div class="section">-->
      <!--<h2>{{ $t("settings.language.title") }}</h2>-->
      <!--<select v-model="$store.state.settings.language">-->
        <!--<option v-for="language in $store.state.settings.availableLanguages" v-bind:value="language.id" v-bind:key="language.id">{{ $t(language.text) }}</option>-->
      <!--</select>-->
      <!--<button @click="saveLanguage">{{ $t("common.save.button") }}</button>-->
    <!--</div>-->
    <!--<div class="section">-->
      <!--<h2>{{ $t("settings.maxVolume.title") }}</h2>-->
        <!--<input v-model="$store.state.settings.maxVolume" type="number" min="0" max="100">-->
      <!--<button @click="saveMaxVolume">{{ $t("common.save.button") }}</button>-->
    <!--</div>-->
    <!--<div class="section">-->
      <!--<h2>{{ $t("settings.playMode.title") }}</h2>-->
      <!--<select v-model="$store.state.settings.playMode">-->
        <!--<option value="RESUME">{{ $t("settings.resume.text") }}</option>-->
        <!--<option value="RESET">{{ $t("settings.reset.text") }}</option>-->
      <!--</select>-->
      <!--<div v-if="$store.state.settings.playMode === 'RESUME'">-->
        <!--{{ $t("settings.resumeAfter.label") }}: <input v-model="$store.state.settings.resetAfterDays"-->
                                       <!--type="number">-->
      <!--</div>-->
      <!--<button @click="savePlayMode">{{ $t("common.save.button") }}</button>-->
    <!--</div>-->
    <!--<div class="section">-->
      <!--<h2>{{ $t("settings.accounts.title") }}</h2>-->
      <!--<li>-->
        <!--<AccountListItem-->
          <!--v-for="account in $store.state.settings.accounts"-->
          <!--v-if="account.configurable"-->
          <!--v-bind:item="account"-->
          <!--v-bind:key="account.id">-->
        <!--</AccountListItem>-->
      <!--</li>-->
    <!--</div>-->
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
    },
    saveMaxVolume: function () {
      this.$store.dispatch('saveMaxVolume', this.$store.state.settings.maxVolume);
    }
  },
  beforeMount: function () {
    this.$store.dispatch('loadAccounts');
    this.$store.dispatch('loadPlayMode');
    this.$store.dispatch('loadMaxVolume');
  }
};
</script>
