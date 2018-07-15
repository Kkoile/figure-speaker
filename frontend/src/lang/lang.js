import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './en';
import de from './de';

Vue.use(VueI18n);

const messages = {
  en,
  de
};

export default new VueI18n({
  fallbackLocale: 'en',
  messages
});
