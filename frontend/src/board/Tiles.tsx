import { TileProps } from "./Tile";
import { ItemTileMemoized } from "./ItemTile";
import { StartingTileMemoized } from "./StartingTile";

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

export type FixedTileCoordinates = {
  x: number;
  y: number;
};

/**
 * These are the fixes tiles which cannot be moved
 */
export const fixedTiles: readonly (TileProps & FixedTileCoordinates)[] = [
  { type: "L", rotation: 90, content: <StartingTileMemoized color="green" />, x: 0, y: 0 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="genie" />, x: 2, y: 0 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="map" />, x: 4, y: 0 },
  { type: "L", rotation: 180, content: <StartingTileMemoized color="red" />, x: 6, y: 0 },
  { type: "T", rotation: 90, content: <ItemTileMemoized item="candles" />, x: 0, y: 2 },
  { type: "T", rotation: 90, content: <ItemTileMemoized item="chest" />, x: 2, y: 2 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="crown" />, x: 4, y: 2 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="book" />, x: 6, y: 2 },
  { type: "T", rotation: 90, content: <ItemTileMemoized item="armor" />, x: 0, y: 4 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="emerald" />, x: 2, y: 4 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="keys" />, x: 4, y: 4 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="moneysack" />, x: 6, y: 4 },
  { type: "L", rotation: 0, content: <StartingTileMemoized color="blue" />, x: 0, y: 6 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="sword" />, x: 2, y: 6 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="skull" />, x: 4, y: 6 },
  { type: "L", rotation: 270, content: <StartingTileMemoized color="yellow" />, x: 6, y: 6 },
];

/**
 * All the other tiles which can me moved and rotated
 * Note that one is left out for the player
 */
export const movableTiles: readonly (Omit<TileProps, "rotation"> | undefined)[] = [
  { type: "T", content: <ItemTileMemoized item="ring" /> },
  { type: "T", content: <ItemTileMemoized item="ghost" /> },
  { type: "T", content: <ItemTileMemoized item="dragon" /> },
  { type: "T", content: <ItemTileMemoized item="bat" /> },
  { type: "T", content: <ItemTileMemoized item="elf" /> },
  { type: "T" },
  { type: "T" }, // hmm is this the correct one? count them...

  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },

  { type: "L", content: <ItemTileMemoized item="lizzard" /> },
  { type: "L", content: <ItemTileMemoized item="owl" /> },
  { type: "L", content: <ItemTileMemoized item="moth" /> },
  { type: "L", content: <ItemTileMemoized item="spider" /> },
  { type: "L", content: <ItemTileMemoized item="scarab" /> },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
  { type: "L" },
];
