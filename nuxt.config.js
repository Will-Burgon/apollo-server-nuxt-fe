import colors from "vuetify/es5/util/colors";
import "md5";
const env = require("dotenv").config();
const path = require("path");
let development = process.env.NODE_ENV !== "production";
export default {
  mode: "universal",
  // env: env.parsed,
  env: {
    access_key_id: process.env.ACCESS_KEY_ID,
    secret_access_key: process.env.SECRET_ACCESS_KEY
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
      // {
      //   hid: "description",
      //   name: "description",
      //   content: process.env.npm_package_description || ""
      // }
    ],
    link: [
      // { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Lato&display=swap"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["~/css/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/getAuth.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/apollo",
    ["cookie-universal-nuxt", { alias: "cookiz", parseJSON: false }]
  ],
  apollo: {
    // optional, default: 7 (days)
    includeNodeModules: false, // optional, default: false (this includes graphql-tag for node_modules folder)
    authenticationType: "Basic", // optional, default: 'Bearer'
    // optional
    // required
    clientConfigs: {
      default: "~/lib/apollo.js"
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: development
      ? "https://nuxt--images--backend--dev.herokuapp.com/v1/graphql"
      : "https://nuxt--images--backend.herokuapp.com/v1/graphql"
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    defaultAssets: {
      icons: "md"
    },
    icons: {
      iconFont: "md"
    },
    theme: {
      themes: {
        light: {
          primary: colors.blueGrey.base,
          secondary: colors.amber.base,
          accent: colors.indigo.base,
          error: colors.brown.base,
          warning: colors.red.base,
          info: colors.teal.base,
          success: colors.green.base,
          white: colors.shades.white,
          form: colors.teal.lighten4,
          grey: colors.grey.lighten2,
          white: colors.shades.white
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
  // generate: {
  //   fallback: true
  // },
  // buildDir: path.resolve(__dirname, "../public"),
  // devServer: {
  //   proxy: {
  //     "/v1/graphql": {
  //       target: "http://localhost:4500/v1/graphql"
  //     }
  //   }
  // }
};
