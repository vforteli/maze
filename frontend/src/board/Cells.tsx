import { CellProps, ICell, LCell, TCell } from "./Cell";
import { ItemCellMemoized } from "./ItemCell";
import { StartingCellMemoized } from "./StartingCell";

export const things = [
  "genie",
  "ring",
  "map",
  "ghost",
  "rat",
  "dragon",
  "troll",
  "candles",
  "chest",
  "crown",
  "book",
  "lizzard",
  "bat",
  "owl",
  "moth",
  "spider",
  "armor",
  "emerald",
  "keys",
  "moneysack",
  "elf",
  "scarab",
  "sword",
  "skull",
] as const;

export type Thing = (typeof things)[number];

/**
 * These are the fixes cells which cannot be moved
 */
export const fixedCells: readonly (CellProps | undefined)[] = [
  { openings: LCell, rotation: 90, content: <StartingCellMemoized color="green" /> },
  undefined,
  { openings: TCell, rotation: 180, content: <ItemCellMemoized item="genie" /> },
  undefined,
  { openings: TCell, rotation: 180, content: <ItemCellMemoized item="map" /> },
  undefined,
  { openings: LCell, rotation: 180, content: <StartingCellMemoized color="red" /> },
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  { openings: TCell, rotation: 90, content: <ItemCellMemoized item="candles" /> },
  undefined,
  { openings: TCell, rotation: 90, content: <ItemCellMemoized item="chest" /> },
  undefined,
  { openings: TCell, rotation: 180, content: <ItemCellMemoized item="crown" /> },
  undefined,
  { openings: TCell, rotation: 270, content: <ItemCellMemoized item="book" /> },
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  { openings: TCell, rotation: 90, content: <ItemCellMemoized item="armor" /> },
  undefined,
  { openings: TCell, rotation: 0, content: <ItemCellMemoized item="emerald" /> },
  undefined,
  { openings: TCell, rotation: 270, content: <ItemCellMemoized item="keys" /> },
  undefined,
  { openings: TCell, rotation: 270, content: <ItemCellMemoized item="moneysack" /> },
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  { openings: LCell, rotation: 0, content: <StartingCellMemoized color="blue" /> },
  undefined,
  { openings: TCell, rotation: 0, content: <ItemCellMemoized item="sword" /> },
  undefined,
  { openings: TCell, rotation: 0, content: <ItemCellMemoized item="skull" /> },
  undefined,
  { openings: LCell, rotation: 270, content: <StartingCellMemoized color="yellow" /> },
];

/**
 * All the other cells which can me moved and rotated
 * Note that one is left out for the player
 */
export const movableCells: readonly (Omit<CellProps, "rotation"> | undefined)[] = [
  { openings: TCell, content: <ItemCellMemoized item="ring" /> },
  { openings: TCell, content: <ItemCellMemoized item="ghost" /> },
  { openings: TCell, content: <ItemCellMemoized item="dragon" /> },
  { openings: TCell, content: <ItemCellMemoized item="bat" /> },
  { openings: TCell, content: <ItemCellMemoized item="elf" /> },
  { openings: TCell },
  { openings: TCell }, // hmm is this the correct one? count them...

  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },
  { openings: ICell },

  { openings: LCell, content: <ItemCellMemoized item="lizzard" /> },
  { openings: LCell, content: <ItemCellMemoized item="owl" /> },
  { openings: LCell, content: <ItemCellMemoized item="moth" /> },
  { openings: LCell, content: <ItemCellMemoized item="spider" /> },
  { openings: LCell, content: <ItemCellMemoized item="scarab" /> },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
  { openings: LCell },
];

/*

6 or 7? * T
16 * fixed
11 * I
16 * L

*/
