import "nuxt-isomorphic-fetch";
//import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-boost";
const cache = new InMemoryCache();
import axios from "@nuxtjs/axios";
// export default new ApolloClient({
//   link: "http://localhost:4500/graphql",
//   cache
// });
let development = process.env.NODE_ENV !== "production";
export default function(context) {
  return {
    httpLinkOptions: {
      uri: development
        ? "https://nuxt--images--backend--dev.herokuapp.com/v1/graphql"
        : "https://nuxt--images--backend.herokuapp.com/v1/graphql",
      credentials: "same-origin"
    },
    cache

    // wsEndpoint: "ws://localhost:4500/v1/graphql"
  };
}
