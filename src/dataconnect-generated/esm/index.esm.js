import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'alo-coffee',
  location: 'us-east4'
};

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const getAvailableMenuItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableMenuItems');
}
getAvailableMenuItemsRef.operationName = 'GetAvailableMenuItems';

export function getAvailableMenuItems(dc) {
  return executeQuery(getAvailableMenuItemsRef(dc));
}

export const placeOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'PlaceOrder', inputVars);
}
placeOrderRef.operationName = 'PlaceOrder';

export function placeOrder(dcOrVars, vars) {
  return executeMutation(placeOrderRef(dcOrVars, vars));
}

export const updateMenuItemAvailabilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMenuItemAvailability', inputVars);
}
updateMenuItemAvailabilityRef.operationName = 'UpdateMenuItemAvailability';

export function updateMenuItemAvailability(dcOrVars, vars) {
  return executeMutation(updateMenuItemAvailabilityRef(dcOrVars, vars));
}

