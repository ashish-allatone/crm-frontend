export const hasPermission = (module, action) => {

  // 🔥 STEP 1: get user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

//   🔥 STEP 2: ADMIN BYPASS
  if (user?.roles?.some(r => r.name === "Admin")) {
    return true;
  }

  // 🔥 STEP 3: normal permission check
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");

  const p = perms.find((x) => x.module === module);

  if (!p) return false;

  if (action === "VIEW") return p.canView;
  if (action === "ADD") return p.canAdd;
  if (action === "EDIT") return p.canEdit;

  return false;
};