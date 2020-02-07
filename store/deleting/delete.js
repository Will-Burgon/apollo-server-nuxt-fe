import { client } from "@/store/index";
import { DELETE_CUSTOMER } from "@/lib/queries/queries";

export const state = () => ({
  finishedDeletingMessage: ""
});

export const mutations = {
  activateDeletingMessage(state, payload) {
    state.finishedDeletingMessage = payload;
  }
};

export const actions = {
  deleteCustomer: ({ commit }, payload) => {
    client
      .mutate({
        mutation: DELETE_CUSTOMER,
        variables: payload
      })
      .then(({ data }) => {
        if (!data) {
          commit("activateDeletingMessage", "You have not deleted this Job");
        }
        commit(
          "activateDeletingMessage",
          "You have successfully deleted this Job"
        );
      });
  }
};

export const getters = {
  deletingMessage: state => state.finishedDeletingMessage
};
