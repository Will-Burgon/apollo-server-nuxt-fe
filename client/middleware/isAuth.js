export default function(context) {
  console.log("State token", context.app.$cookiz.get("jwt"));
  if (!context.app.$cookiz.get("jwt")) {
    return context.redirect("/admin/auth/login");
  } else {
    console.log("getting admin");
    context.store.dispatch("getCurrentAdmin");
  }
}
