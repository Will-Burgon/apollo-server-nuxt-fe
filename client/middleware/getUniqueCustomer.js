import { GET_INDIVIDUAL } from "~/lib/queries/queries.js";
export default async function({ params, route, app }) {
  let client = app.apolloProvider.defaultClient;

  if (route.name === "admin-customers-id-unique") {
    const images = await client
      .query({
        query: GET_INDIVIDUAL,
        variables: { uniqueID: params.unique }
      })
      .then(({ data }) => {
        return {
          images: data.getIndividual.images
        };
      });
    return images;
  }
}
