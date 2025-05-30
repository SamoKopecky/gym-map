import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {
  VBtn,
  VCard,
  VCardText,
  VDialog,
  VDivider,
  VMenu,
  VSelect,
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
  },
  directives,
})

createApp(App).use(vuetify).mount('#app')
