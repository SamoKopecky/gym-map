import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import {
  VBtn,
  VCard,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VDialog,
  VDivider,
  VIcon,
  VMenu,
  VSelect,
  VSpacer,
  VTextarea,
} from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createApp } from 'vue'
import App from './App.vue'

const vuetify = createVuetify({
  components: {
    VSelect,
    VDialog,
    VTextarea,
    VCard,
    VCardText,
    VDivider,
    VBtn,
    VMenu,
    VCardTitle,
    VCardSubtitle,
    VIcon,
    VSpacer,
  },
  icons: {
    defaultSet: 'mdi',
  },
  directives,
})

createApp(App).use(vuetify).mount('#app')
