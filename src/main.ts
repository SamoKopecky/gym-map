import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"
import VueKeyCloak from "@dsb-norge/vue-keycloak-js"
import { messages } from "@/messages"
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
  VCarousel,
  VCarouselItem,
  VCheckbox,
  VChip,
  VChipGroup,
  VCol,
  VCombobox,
  VContainer,
  VDataTable,
  VDefaultsProvider,
  VDialog,
  VDivider,
  VExpandTransition,
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VFab,
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
  VBtnToggle,
  VNumberInput,
  VOverlay,
  VProgressCircular,
  VProgressLinear,
  VRadio,
  VRadioGroup,
  VResponsive,
  VRow,
  VSelect,
  VSheet,
  VSlider,
  VSlideYTransition,
  VSpacer,
  VSpeedDial,
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
import { createI18n } from "vue-i18n"

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
    VCarousel,
    VOverlay,
    VCarouselItem,
    VDefaultsProvider,
    VAppBarTitle,
    VSheet,
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
    VBtnToggle,
    VTextarea,
    VCard,
    VCardText,
    VDivider,
    VBtn,
    VSpeedDial,
    VFab,
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

const i18n = createI18n({
  legacy: false,
  locale: "cs",
  fallbackLocale: "en",
  messages: messages,
})

app
  .use(vuetify)
  .use(router)
  .use(pinia)
  .use(i18n)
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
