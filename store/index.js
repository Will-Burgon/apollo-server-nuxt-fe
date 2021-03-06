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
  DELETE_INDIVIDUAL,
  CREATE_EMAIL,
  DELETE_CUSTOMER
} from "~/lib/queries/queries";

import ApolloClient from "apollo-boost";

import fetch from "node-fetch";

import Cookie from "js-cookie";

let token;

let localToken;
let development = process.env.NODE_ENV !== "production";
let graphQlErrors = "";
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
        if (err.extensions.code === 1) {
          graphQlErrors = err.extensions.code;
        }
        if (err.extensions.code === 2) {
          graphQlErrors = err.extensions.code;
        }
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
  customer: null,
  adminFromToken: false,
  newIndividual: null,
  individuals: [],
  individual: null,
  finishedDeletingMessage: "",
  emailError: false,
  individualError: false
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
  setCustomer: (state, payload) => {
    state.customer = payload;
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
    const individual = {};
    individual.id = payload.customer._id;
    individual.details = payload;
    Vue.set(state.individuals, state.individuals.length, individual);
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
    const individual = { id: payload.customer._id, details: payload };
    Vue.set(state.individuals, state.individuals.length, individual);
  },
  fetchIndividuals(state, payload) {
    state.individuals = payload.map(ind => {
      return {
        id: ind.customer._id,
        details: ind
      };
    });
  },
  fetchIndividualsFromRouter(state, payload) {
    state.individuals = payload;
  },
  fetchIndividual(state, payload) {
    state.individual = payload;
  },
  deletedInvidual(state, payload) {
    const individual = state.individuals.findIndex(
      person => person.details.uniqueID === payload.deleteIndividual.uniqueID
    );
    if (state.individuals.length > 1) {
      Vue.delete(state.individuals, individual);
    } else {
      state.individuals = [];
    }
  },
  activateDeletingMessage(state, payload) {
    state.finishedDeletingMessage = payload;
  },
  setEmailError(state, payload) {
    state.emailError = payload;
  },
  setIndividualError(state, payload) {
    state.individualError = payload;
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
        if (data !== null) {
          console.log("Response From getCurrentAdmin in store", data);
          commit("setAdmin", data.getCurrentAdmin);
          Cookie.set("user", data.getCurrentAdmin.name.replace(" ", "-"));
          if (process.client) {
            sessionStorage.setItem(
              "user",
              Cookie.get("user").replace(" ", "-")
            );
          }
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
        query: GET_CUSTOMERS
      })
      .then(({ data }) => {
        commit("setCustomers", data.getCustomers);
      });
  },
  async getCustomer({ commit }, payload) {
    await client
      .query({
        query: CUSTOMER_QUERY,
        variables: payload
      })
      .then(({ data }) => {
        console.log("Getting customer from store", data);
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
        console.log(data);
        commit("setIndividual", data.createIndividual);
        commit("setLoading", false);
      });
  },
  getIndividuals({ commit }, payload) {
    client
      .query({
        query: GET_INDIVIDUALS,
        variables: payload
      })
      .then(({ data }) => {
        console.log("Tracing Individuals", data.getIndividuals);
        commit("fetchIndividuals", data.getIndividuals);
      });
  },
  getIndividual({ commit }, payload) {
    client
      .query({
        query: GET_INDIVIDUAL,
        variables: payload
      })
      .then(({ data }) => {
        console.log(data.getIndividual);
        commit("fetchIndividual", data.getIndividual);
      });
  },
  deleteIndividual({ commit }, payload) {
    client
      .mutate({
        mutation: DELETE_INDIVIDUAL,
        variables: payload
      })
      .then(({ data }) => {
        console.log("data from delete mutation", data);
        commit("deletedInvidual", data);
      });
  },
  deleteCustomer: ({ commit }, payload) => {
    console.log(JSON.stringify(payload.ID));
    client
      .mutate({
        mutation: DELETE_CUSTOMER,
        variables: payload
      })
      .then(({ data }) => data);
  },
  createEmail({ commit }, payload) {
    try {
      console.log(client);
      client
        .mutate({
          mutation: CREATE_EMAIL,
          variables: payload
        })
        .then(({ data }) => {
          console.log("CreateEmail", data);
          if (data.createEmail === null) {
            commit("setEmailError", true);
          } else {
            data.createEmail.email === payload.email
              ? commit("setLoading", true)
              : null;
          }
        })
        .catch(err => {
          if (graphQlErrors === 2) {
            commit("setIndividualError", true);
          }
          if (graphQlErrors === 1) {
            commit("setEmailError", true);
          }
        });
    } catch (err) {
      console.log("Pish", err, client);
    }
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
  individual: state => state.individual,
  emailError: state => state.emailError,
  individualError: state => state.individualError
};
