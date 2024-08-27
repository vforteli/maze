import { AsyncThunkPayloadCreator, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch?: AppDispatch;
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
}>();

export type ThunkApiType = Parameters<Parameters<typeof createAppAsyncThunk>[1]>[1];

export const createErrorHandlingAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: RootState }>,
  errorMessage?: string,
) => {
  return createAppAsyncThunk<Returned, ThunkArg>(typePrefix, async (arg, thunkAPI) => {
    try {
      return (await payloadCreator(arg, thunkAPI)) as Awaited<Returned>;
    } catch (err) {
      console.debug(err);
      console.debug("heh");
      console.debug(errorMessage);
      throw err;
    }
  });
};

export function withErrorHandling<Returned, ThunkArg>(payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: RootState }>, message?: string) {
  return async (arg: ThunkArg, thunkAPI: ThunkApiType) => {
    try {
      return (await payloadCreator(arg, thunkAPI)) as Awaited<Returned>;
    } catch (err) {
      console.debug(err);
      console.debug("ERROR from error handling thunkish!");
      console.debug(message);
      throw err;
    }
  };
}
