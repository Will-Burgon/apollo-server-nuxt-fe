//import Vuex from "vuex";
//import apollo from "~/lib/apollo";
import Vue from "vue";
import {
  COLLECTION_QUERY,
  SIGN_IN_ADMIN,
  GET_CURRENT_ADMIN,
  CREATE_CUSTOMER,
  GET_CUSTOMERS,
  CREATE_COLLECTION,
  CUSTOMER_QUERY,
  CREATE_INDIVIDUAL,
  GET_INDIVIDUALS,
  GET_INDIVIDUAL,
  CREATE_EMAIL
} from "~/lib/queries/queries";

import ApolloClient from "apollo-boost";

import fetch from "node-fetch";

import Cookie from "js-cookie";

let token;

let localToken;
let development = process.env.NODE_ENV !== "production";

export const client = new ApolloClient({
  // include with token with requests made to backend
  fetch,
  uri: development
    ? "https://nuxt--images--backend--dev.herokuapp.com/v1/graphql"
    : "https://nuxt--images--backend.herokuapp.com/v1/graphql",
  credentials: "same-origin",

  request: operation => {
    if (process.server) {
      if (!token) {
        token = "";
      }
      console.log("Token before ApolloClient inits", token);
      operation.setContext({
        headers: {
          authorization: token
        }
      });
    }
    //if no token in sessionStorage we'll set one. Prevents errors server side
    //Make sure we check to see that we are runnnig on the client otherwise sessionStorage will be undefined
    // if (process.client)  {
    if (process.client) {
      //sessionStorage.clear();
      sessionStorage.getItem("token") !== null
        ? (localToken = sessionStorage.getItem("token"))
        : (localToken = "") && sessionStorage.setItem("token", "");
      console.log("In APC, local storage?", sessionStorage.getItem("token"));
      //operation adds the token to an authorization header, which is sent to the backend
      operation.setContext({
        headers: {
          authorization: localToken
        }
      });
    }
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log("graphQlErrors", err);
      }
    }
    if (networkError) {
      console.log(
        "[networkError]: ",
        networkError.name,
        networkError.response,
        networkError.result
      );
    }
  }
});

export const state = () => ({
  collections: [],
  admin: null,
  loading: false,
  newCustomer: null,
  customers: [],
  token: null,
  newCollection: [],
  customer: {},
  adminFromToken: false,
  newIndividual: null,
  individuals: [{ id: "", details: {} }],
  individual: null
});

export const mutations = {
  setCollections: (state, payload) => {
    state.collections = payload;
  },
  setAdmin: (state, payload) => {
    state.admin = payload;
  },
  setLoading: (state, payload) => {
    state.loading = payload;
  },
  clearAdmin: state => {
    state.admin = null;
  },
  setNewCustomer: (state, payload) => {
    state.newCustomer = payload;
  },
  setCustomers: (state, payload) => {
    state.customers = payload;
  },
  addCustomersToState: (state, payload) => {
    Vue.set(state.customers, state.customers.length, payload);
  },
  subtractCustomersFromState: (state, payload) => {
    if (Array.isArray(state.customers[0])) return false;
    Vue.delete(state.customers, payload);
  },
  addIndividualsToState: (state, payload) => {
    Vue.set(state.individuals, state.individuals.length, payload);
  },
  setToken(state, token) {
    state.token = token;
  },
  clearToken(state) {
    state.token = null;
  },
  setNewCollection(state, payload) {
    state.newCollection = payload;
  },
  setCustomer(state, payload) {
    state.customer = payload;
  },
  setAdminFromToken(state, payload) {
    state.adminFromToken = payload;
  },
  setIndividual(state, payload) {
    state.newIndividual = payload;
  },
  fetchIndividuals(state, payload) {
    state.individuals = payload.map(ind => {
      return {
        id: ind.customer._id,
        details: ind
      };
    });
  },
  fetchIndividual(state, payload) {
    state.individual = payload;
  }
};
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { app, route }) {
    //await client.resetStore();
    token = await app.$cookiz.get("jwt");

    token ? commit("setToken", token) : null;
    console.log("Token from NSI", token);
    // if (route.params.id) {
    //   client
    //     .query({
    //       query: GET_INDIVIDUALS,
    //       variables: { customer: route.params.id }
    //     })
    //     .then(({ data }) => {
    //       commit("fetchIndividuals", data.getIndividuals);
    //       console.log("from nuxtserverinit", data.getIndividuals);
    //     });
    // }
  },
  getCurrentAdmin({ commit }) {
    client
      .query({
        prefetch: true,
        query: GET_CURRENT_ADMIN
      })
      .then(({ data }) => {
        console.log("Response From getCurrentAdmin", data);
        commit("setAdmin", data.getCurrentAdmin);
        Cookie.set("user", data.getCurrentAdmin.name.replace(" ", "-"));
        if (process.client) {
          sessionStorage.setItem("user", Cookie.get("user").replace(" ", "-"));
        }
      })
      .catch(err => {
        console.log("Error From getCurrentAdmin", err);
      });
  },
  getCollections({ commit }) {
    commit("setLoading", true);
    client
      .query({
        prefetch: true,
        query: COLLECTION_QUERY
      })
      .then(({ data }) => {
        commit("setCollections", data.getCollection);
        commit("setLoading", false);
      })
      .catch(err => console.log(err));
  },
  signInAdmin({ commit }, payload) {
    client
      .mutate({
        mutation: SIGN_IN_ADMIN,
        variables: payload
      })
      .then(({ data }) => {
        const expirationDate = new Date().getTime() + 3600000;
        sessionStorage.setItem("token", data.signInAdmin.token);
        sessionStorage.setItem("tokenExpiration", expirationDate);
        Cookie.set("jwt", data.signInAdmin.token);
        Cookie.set("expirationDate", expirationDate);
        commit("setToken", data.signInAdmin.token);

        //In order for us to check that the Admin is authenticated we need to refresh the page so the plugin will work.
        this.app.router.push("/");
      })

      .catch(err => console.log(err));
  },
  async signOutAdmin({ commit }) {
    //Clear admin in state
    commit("clearAdmin");
    commit("clearToken");
    //Delete token
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("tokenExpiration", "");
    sessionStorage.setItem("user", "");
    Cookie.set("jwt", "");
    Cookie.set("expirationDate", "");
    Cookie.set("user", "");
    //End session
    await client.resetStore();
    //Redirect to home page
    this.app.router.push("/");
  },
  createCustomer({ commit }, payload) {
    client
      .mutate({
        mutation: CREATE_CUSTOMER,
        variables: payload
      })
      .then(({ data }) => {
        // commit("setNewCustomer", data.createCustomer);
        commit("addCustomersToState", data.createCustomer);
      });
  },
  getCustomers({ commit }) {
    client
      .query({
        prefetch: true,
        query: GET_CUSTOMERS
      })
      .then(({ data }) => {
        commit("setCustomers", data.getCustomers);
      });
  },
  getCustomer({ commit }, payload) {
    client
      .query({
        query: CUSTOMER_QUERY,
        prefetch: true,
        variables: payload
      })
      .then(({ data }) => {
        commit("setCustomer", data.getCustomer);
      });
  },
  createCollection({ commit }, payload) {
    client
      .mutate({
        mutation: CREATE_COLLECTION,
        variables: payload
      })
      .then(({ data }) => {
        commit("setNewCollection", data.createCollection);
      });
  },
  createIndividual({ commit }, payload) {
    client
      .mutate({
        mutation: CREATE_INDIVIDUAL,
        variables: payload
      })
      .then(({ data }) => {
        commit("setIndividual", data.createIndividual);
      });
    this.app.router.push(`/admin/customers/${payload.customer}`);
  },
  getIndividuals({ commit }, payload) {
    client
      .query({
        query: GET_INDIVIDUALS,
        variables: payload
      })
      .then(({ data }) => {
        commit("fetchIndividuals", data.getIndividuals);
        console.log("from async", data.getIndividuals);
      });
  },
  getIndividual({ commit }, payload) {
    client
      .query({
        query: GET_INDIVIDUAL,
        variables: payload
      })
      .then(({ data }) => {
        commit("fetchIndividual", data.getIndividual);
      });
  },
  createEmail({ commit }, payload) {
    client
      .mutate({
        mutation: CREATE_EMAIL,
        variables: payload
      })
      .then(({ data }) => {
        console.log(data);
      });
  }
};

export const getters = {
  collections: state => state.collections,
  loading: state => state.loading,
  admin: state => state.admin,
  token: state => state.token,
  adminName: state => {
    if (state.admin) {
      return state.admin.name;
    } else {
      let user = Cookie.get("user");
      if (user) {
        return user.replace("-", " ");
      }
    }
  },
  customers: state => state.customers,
  customer: state => state.customer,
  adminFromToken: state => state.adminFromToken,
  individuals: state => state.individuals,
  individual: state => state.individual
};
