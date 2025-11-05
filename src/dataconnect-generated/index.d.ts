import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  displayName: string;
  email: string;
  phoneNumber?: string | null;
}

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

export interface MenuItem_Key {
  id: UUIDString;
  __typename?: 'MenuItem_Key';
}

export interface OrderItem_Key {
  orderId: UUIDString;
  menuItemId: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface PlaceOrderData {
  order_insert: Order_Key;
}

export interface PlaceOrderVariables {
  customerId: UUIDString;
  deliveryAddress?: string | null;
  notes?: string | null;
  pickupTime?: TimestampString | null;
  totalAmount: number;
  status: string;
}

export interface UpdateMenuItemAvailabilityData {
  menuItem_update?: MenuItem_Key | null;
}

export interface UpdateMenuItemAvailabilityVariables {
  id: UUIDString;
  isAvailable: boolean;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetAvailableMenuItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAvailableMenuItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAvailableMenuItemsData, undefined>;
  operationName: string;
}
export const getAvailableMenuItemsRef: GetAvailableMenuItemsRef;

export function getAvailableMenuItems(): QueryPromise<GetAvailableMenuItemsData, undefined>;
export function getAvailableMenuItems(dc: DataConnect): QueryPromise<GetAvailableMenuItemsData, undefined>;

interface PlaceOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: PlaceOrderVariables): MutationRef<PlaceOrderData, PlaceOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: PlaceOrderVariables): MutationRef<PlaceOrderData, PlaceOrderVariables>;
  operationName: string;
}
export const placeOrderRef: PlaceOrderRef;

export function placeOrder(vars: PlaceOrderVariables): MutationPromise<PlaceOrderData, PlaceOrderVariables>;
export function placeOrder(dc: DataConnect, vars: PlaceOrderVariables): MutationPromise<PlaceOrderData, PlaceOrderVariables>;

interface UpdateMenuItemAvailabilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMenuItemAvailabilityVariables): MutationRef<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMenuItemAvailabilityVariables): MutationRef<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;
  operationName: string;
}
export const updateMenuItemAvailabilityRef: UpdateMenuItemAvailabilityRef;

export function updateMenuItemAvailability(vars: UpdateMenuItemAvailabilityVariables): MutationPromise<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;
export function updateMenuItemAvailability(dc: DataConnect, vars: UpdateMenuItemAvailabilityVariables): MutationPromise<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;

