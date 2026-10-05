// export const checkPermission = (permissions, module) => {
//   const modulePermission = permissions?.find(
//     (item) => item.permission_module === module
//   );

//   if (!modulePermission) return false;

//   // Case 1: can_do_all true
//   if (modulePermission.can_do_all) return true;

//   const actions = [
//     "can_add",
//     "can_update",
//     "can_list",
//     "can_retrieve",
//     "can_delete",
//     "can_assign_permission"
//   ];

//   // Case 2: find first true action
//   const allowedAction = actions.find(
//     (action) => modulePermission[action] === true
//   );

//   if (allowedAction) {
//     return {
//       action: allowedAction,
//       value: true
//     };
//   }

//   // Case 3: all false
//   return false;
// };

export const checkPermission = (permissions, module) => {
  const modulePermission = permissions?.find(
    (item) => item.permission_module === module
  );

  if (!modulePermission) return false;

  // Case 1: full access
  if (modulePermission.can_do_all) return true;

  const actions = [
    "can_add",
    "can_update",
    "can_list",
    "can_retrieve",
    "can_delete",
    "can_assign_permission"
  ];

  const allowedActions = {};

  actions.forEach((action) => {
    if (modulePermission[action]) {
      allowedActions[action] = true;
    }
  });

  // Case 3: all false
  if (Object.keys(allowedActions).length === 0) return false;

  // Case 2: return all true actions
  return allowedActions;
};