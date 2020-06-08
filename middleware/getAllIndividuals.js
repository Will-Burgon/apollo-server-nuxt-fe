export default function({ params, store }) {
  store.dispatch("getIndividuals", { customer: params.id });
  console.log("Getting individuals from middleware");
}
