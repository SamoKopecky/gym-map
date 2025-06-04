import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"
import { createVuetify } from "vuetify"
import {
  VApp,
  VAppBar,
  VAppBarTitle,
  VBtn,
  VCard,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VCol,
  VContainer,
  VDialog,
  VDivider,
  VExpandTransition,
  VIcon,
  VLayout,
  VList,
  VListItem,
  VListSubheader,
  VMain,
  VMenu,
  VRow,
  VSelect,
  VSpacer,
  VTab,
  VTabs,
  VTabsWindow,
  VTabsWindowItem,
  VTextarea,
  VWindow,
  VWindowItem,
} from "vuetify/components"
import * as directives from "vuetify/directives"

import { createApp } from "vue"
import App from "./App.vue"

const vuetify = createVuetify({
  components: {
    VSelect,
    VTabs,
    VTabsWindow,
    VTab,
    VLayout,
    VAppBarTitle,
    VMain,
    VContainer,
    VRow,
    VTabsWindowItem,
    VCol,
    VAppBar,
    VWindow,
    VWindowItem,
    VApp,
    VDialog,
    VTextarea,
    VCard,
    VCardText,
    VDivider,
    VBtn,
    VMenu,
    VCardTitle,
    VCardSubtitle,
    VList,
    VIcon,
    VListItem,
    VSpacer,
    VListSubheader,
    VExpandTransition,
  },
  icons: {
    defaultSet: "mdi",
  },
  directives,
})

createApp(App).use(vuetify).mount("#app")
