import type { SomeNestedEventThingy } from "./SomeNestedEventThingy";

export type EventThingy = {
  eventName: string;
  eventType: string;
  nestedEvent: SomeNestedEventThingy;
};