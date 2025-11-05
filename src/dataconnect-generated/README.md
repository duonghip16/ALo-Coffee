# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetAvailableMenuItems*](#getavailablemenuitems)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*PlaceOrder*](#placeorder)
  - [*UpdateMenuItemAvailability*](#updatemenuitemavailability)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetAvailableMenuItems
You can execute the `GetAvailableMenuItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAvailableMenuItems(): QueryPromise<GetAvailableMenuItemsData, undefined>;

interface GetAvailableMenuItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAvailableMenuItemsData, undefined>;
}
export const getAvailableMenuItemsRef: GetAvailableMenuItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAvailableMenuItems(dc: DataConnect): QueryPromise<GetAvailableMenuItemsData, undefined>;

interface GetAvailableMenuItemsRef {
  ...
  (dc: DataConnect): QueryRef<GetAvailableMenuItemsData, undefined>;
}
export const getAvailableMenuItemsRef: GetAvailableMenuItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAvailableMenuItemsRef:
```typescript
const name = getAvailableMenuItemsRef.operationName;
console.log(name);
```

### Variables
The `GetAvailableMenuItems` query has no variables.
### Return Type
Recall that executing the `GetAvailableMenuItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAvailableMenuItemsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAvailableMenuItemsData {
  menuItems: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    category: {
      id: UUIDString;
      name: string;
    } & Category_Key;
  } & MenuItem_Key)[];
}
```
### Using `GetAvailableMenuItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAvailableMenuItems } from '@dataconnect/generated';


// Call the `getAvailableMenuItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAvailableMenuItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAvailableMenuItems(dataConnect);

console.log(data.menuItems);

// Or, you can use the `Promise` API.
getAvailableMenuItems().then((response) => {
  const data = response.data;
  console.log(data.menuItems);
});
```

### Using `GetAvailableMenuItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAvailableMenuItemsRef } from '@dataconnect/generated';


// Call the `getAvailableMenuItemsRef()` function to get a reference to the query.
const ref = getAvailableMenuItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAvailableMenuItemsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.menuItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItems);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  email: string;
  phoneNumber?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  phoneNumber: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., email: ..., phoneNumber: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  phoneNumber: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., email: ..., phoneNumber: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## PlaceOrder
You can execute the `PlaceOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
placeOrder(vars: PlaceOrderVariables): MutationPromise<PlaceOrderData, PlaceOrderVariables>;

interface PlaceOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: PlaceOrderVariables): MutationRef<PlaceOrderData, PlaceOrderVariables>;
}
export const placeOrderRef: PlaceOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
placeOrder(dc: DataConnect, vars: PlaceOrderVariables): MutationPromise<PlaceOrderData, PlaceOrderVariables>;

interface PlaceOrderRef {
  ...
  (dc: DataConnect, vars: PlaceOrderVariables): MutationRef<PlaceOrderData, PlaceOrderVariables>;
}
export const placeOrderRef: PlaceOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the placeOrderRef:
```typescript
const name = placeOrderRef.operationName;
console.log(name);
```

### Variables
The `PlaceOrder` mutation requires an argument of type `PlaceOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface PlaceOrderVariables {
  customerId: UUIDString;
  deliveryAddress?: string | null;
  notes?: string | null;
  pickupTime?: TimestampString | null;
  totalAmount: number;
  status: string;
}
```
### Return Type
Recall that executing the `PlaceOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `PlaceOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface PlaceOrderData {
  order_insert: Order_Key;
}
```
### Using `PlaceOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, placeOrder, PlaceOrderVariables } from '@dataconnect/generated';

// The `PlaceOrder` mutation requires an argument of type `PlaceOrderVariables`:
const placeOrderVars: PlaceOrderVariables = {
  customerId: ..., 
  deliveryAddress: ..., // optional
  notes: ..., // optional
  pickupTime: ..., // optional
  totalAmount: ..., 
  status: ..., 
};

// Call the `placeOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await placeOrder(placeOrderVars);
// Variables can be defined inline as well.
const { data } = await placeOrder({ customerId: ..., deliveryAddress: ..., notes: ..., pickupTime: ..., totalAmount: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await placeOrder(dataConnect, placeOrderVars);

console.log(data.order_insert);

// Or, you can use the `Promise` API.
placeOrder(placeOrderVars).then((response) => {
  const data = response.data;
  console.log(data.order_insert);
});
```

### Using `PlaceOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, placeOrderRef, PlaceOrderVariables } from '@dataconnect/generated';

// The `PlaceOrder` mutation requires an argument of type `PlaceOrderVariables`:
const placeOrderVars: PlaceOrderVariables = {
  customerId: ..., 
  deliveryAddress: ..., // optional
  notes: ..., // optional
  pickupTime: ..., // optional
  totalAmount: ..., 
  status: ..., 
};

// Call the `placeOrderRef()` function to get a reference to the mutation.
const ref = placeOrderRef(placeOrderVars);
// Variables can be defined inline as well.
const ref = placeOrderRef({ customerId: ..., deliveryAddress: ..., notes: ..., pickupTime: ..., totalAmount: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = placeOrderRef(dataConnect, placeOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_insert);
});
```

## UpdateMenuItemAvailability
You can execute the `UpdateMenuItemAvailability` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMenuItemAvailability(vars: UpdateMenuItemAvailabilityVariables): MutationPromise<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;

interface UpdateMenuItemAvailabilityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMenuItemAvailabilityVariables): MutationRef<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;
}
export const updateMenuItemAvailabilityRef: UpdateMenuItemAvailabilityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMenuItemAvailability(dc: DataConnect, vars: UpdateMenuItemAvailabilityVariables): MutationPromise<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;

interface UpdateMenuItemAvailabilityRef {
  ...
  (dc: DataConnect, vars: UpdateMenuItemAvailabilityVariables): MutationRef<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;
}
export const updateMenuItemAvailabilityRef: UpdateMenuItemAvailabilityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMenuItemAvailabilityRef:
```typescript
const name = updateMenuItemAvailabilityRef.operationName;
console.log(name);
```

### Variables
The `UpdateMenuItemAvailability` mutation requires an argument of type `UpdateMenuItemAvailabilityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMenuItemAvailabilityVariables {
  id: UUIDString;
  isAvailable: boolean;
}
```
### Return Type
Recall that executing the `UpdateMenuItemAvailability` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMenuItemAvailabilityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMenuItemAvailabilityData {
  menuItem_update?: MenuItem_Key | null;
}
```
### Using `UpdateMenuItemAvailability`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMenuItemAvailability, UpdateMenuItemAvailabilityVariables } from '@dataconnect/generated';

// The `UpdateMenuItemAvailability` mutation requires an argument of type `UpdateMenuItemAvailabilityVariables`:
const updateMenuItemAvailabilityVars: UpdateMenuItemAvailabilityVariables = {
  id: ..., 
  isAvailable: ..., 
};

// Call the `updateMenuItemAvailability()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMenuItemAvailability(updateMenuItemAvailabilityVars);
// Variables can be defined inline as well.
const { data } = await updateMenuItemAvailability({ id: ..., isAvailable: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMenuItemAvailability(dataConnect, updateMenuItemAvailabilityVars);

console.log(data.menuItem_update);

// Or, you can use the `Promise` API.
updateMenuItemAvailability(updateMenuItemAvailabilityVars).then((response) => {
  const data = response.data;
  console.log(data.menuItem_update);
});
```

### Using `UpdateMenuItemAvailability`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMenuItemAvailabilityRef, UpdateMenuItemAvailabilityVariables } from '@dataconnect/generated';

// The `UpdateMenuItemAvailability` mutation requires an argument of type `UpdateMenuItemAvailabilityVariables`:
const updateMenuItemAvailabilityVars: UpdateMenuItemAvailabilityVariables = {
  id: ..., 
  isAvailable: ..., 
};

// Call the `updateMenuItemAvailabilityRef()` function to get a reference to the mutation.
const ref = updateMenuItemAvailabilityRef(updateMenuItemAvailabilityVars);
// Variables can be defined inline as well.
const ref = updateMenuItemAvailabilityRef({ id: ..., isAvailable: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMenuItemAvailabilityRef(dataConnect, updateMenuItemAvailabilityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.menuItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItem_update);
});
```

