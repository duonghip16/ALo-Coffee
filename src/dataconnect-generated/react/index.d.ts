import { CreateUserData, CreateUserVariables, GetAvailableMenuItemsData, PlaceOrderData, PlaceOrderVariables, UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useGetAvailableMenuItems(options?: useDataConnectQueryOptions<GetAvailableMenuItemsData>): UseDataConnectQueryResult<GetAvailableMenuItemsData, undefined>;
export function useGetAvailableMenuItems(dc: DataConnect, options?: useDataConnectQueryOptions<GetAvailableMenuItemsData>): UseDataConnectQueryResult<GetAvailableMenuItemsData, undefined>;

export function usePlaceOrder(options?: useDataConnectMutationOptions<PlaceOrderData, FirebaseError, PlaceOrderVariables>): UseDataConnectMutationResult<PlaceOrderData, PlaceOrderVariables>;
export function usePlaceOrder(dc: DataConnect, options?: useDataConnectMutationOptions<PlaceOrderData, FirebaseError, PlaceOrderVariables>): UseDataConnectMutationResult<PlaceOrderData, PlaceOrderVariables>;

export function useUpdateMenuItemAvailability(options?: useDataConnectMutationOptions<UpdateMenuItemAvailabilityData, FirebaseError, UpdateMenuItemAvailabilityVariables>): UseDataConnectMutationResult<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;
export function useUpdateMenuItemAvailability(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMenuItemAvailabilityData, FirebaseError, UpdateMenuItemAvailabilityVariables>): UseDataConnectMutationResult<UpdateMenuItemAvailabilityData, UpdateMenuItemAvailabilityVariables>;
