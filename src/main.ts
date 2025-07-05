import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"
import VueKeyCloak from "@dsb-norge/vue-keycloak-js"
import { createVuetify } from "vuetify"
import {
  VAlert,
  VApp,
  VAppBar,
  VAppBarTitle,
  VAvatar,
  VBadge,
  VBtn,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VCheckbox,
  VChip,
  VChipGroup,
  VCol,
  VCombobox,
  VContainer,
  VDataTable,
  VDialog,
  VDivider,
  VExpandTransition,
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VFileInput,
  VForm,
  VIcon,
  VImg,
  VLabel,
  VLayout,
  VList,
  VListItem,
  VListItemTitle,
  VListSubheader,
  VMain,
  VMenu,
  VNumberInput,
  VProgressCircular,
  VProgressLinear,
  VRadio,
  VRadioGroup,
  VResponsive,
  VRow,
  VSelect,
  VSlider,
  VSlideYTransition,
  VSpacer,
  VSwitch,
  VTab,
  VTabs,
  VTabsWindow,
  VTabsWindowItem,
  VTextarea,
  VTextField,
  VToolbar,
  VWindow,
  VWindowItem,
} from "vuetify/components"
import * as directives from "vuetify/directives"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import { tokenInterceptor } from "./services/base"

const vuetify = createVuetify({
  components: {
    VSelect,
    VTabs,
    VResponsive,
    VCombobox,
    VTabsWindow,
    VTab,
    VCardActions,
    VLayout,
    VForm,
    VAppBarTitle,
    VMain,
    VContainer,
    VAlert,
    VSlideYTransition,
    VLabel,
    VProgressCircular,
    VProgressLinear,
    VRow,
    VTabsWindowItem,
    VAvatar,
    VChip,
    VBadge,
    VRadioGroup,
    VRadio,
    VCol,
    VAppBar,
    VChipGroup,
    VExpansionPanelTitle,
    VWindow,
    VFileInput,
    VTextField,
    VWindowItem,
    VDataTable,
    VApp,
    VDialog,
    VTextarea,
    VCard,
    VCardText,
    VDivider,
    VBtn,
    VMenu,
    VCardTitle,
    VListItem,
    VListItemTitle,
    VCardSubtitle,
    VList,
    VIcon,
    VSpacer,
    VListSubheader,
    VSwitch,
    VExpandTransition,
    VImg,
    VCheckbox,
    VNumberInput,
    VToolbar,
    VExpansionPanelText,
    VSlider,
    VExpansionPanel,
    VExpansionPanels,
  },
  icons: {
    defaultSet: "mdi",
  },
  directives,
})

const viteKeycloakUrl = import.meta.env.VITE_APP_KEYCLOAK_URL ?? "http://localhost:8080"
const pinia = createPinia()

const app = createApp(App)

app
  .use(vuetify)
  .use(router)
  .use(pinia)
  .use(VueKeyCloak, {
    config: {
      url: viteKeycloakUrl,
      realm: "gym-map",
      clientId: "gym-map",
    },
    init: {
      onLoad: "check-sso",
    },
    onReady: () => {
      tokenInterceptor()
      app.mount("#app")
    },
  })
