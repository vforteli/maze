import type { SendMessageModel } from "./SendMessageModel";
import type { DoStuffEnum } from "./DoStuffEnum";

export type DoStuffObjectModel = {
  someBoolean: boolean;
  someNullableBoolean: boolean | null;
  someString: string;
  someNullableString: string | null;
  someInt: number;
  someNullableInt: number | null;
  someDateTime: string;
  someNullableDateTime: string | null;
  someDictionary: Record<string, SendMessageModel>;
  someEnumDictionary: Record<DoStuffEnum, SendMessageModel>;
};