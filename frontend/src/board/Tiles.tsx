import { TileProps } from "./Tile";
import { ItemTileMemoized } from "./ItemTile";
import { StartingTileMemoized } from "./StartingTile";
import { BunnyIcon, CowIcon, CrabIcon, CrocodileIcon, MooseIcon, RaccoonIcon, WildBoarIcon } from "../assets/Icons";

export const things = [
  "cow",
  "wildboar",
  "raccoon",
  "squirrel",
  "rat",
  "dragon",
  "bunny",
  "candles",
  "chest",
  "crown",
  "book",
  "crocodile",
  "bat",
  "owl",
  "moth",
  "spider",
  "armor",
  "emerald",
  "keys",
  "crab",
  "moose",
  "scarab",
  "sword",
  "skull",
] as const;

export type Thing = (typeof things)[number];

export type FixedTileCoordinates = {
  x: number;
  y: number;
};

export const ThingIcons: Partial<Record<Thing, React.ReactElement>> = {
  crocodile: <CrocodileIcon />,
  bunny: <BunnyIcon />,
  cow: <CowIcon />,
  moose: <MooseIcon />,
  wildboar: <WildBoarIcon />,
  raccoon: <RaccoonIcon />,
  // squirrel: <SquirrelIcon />,
  crab: <CrabIcon />,
};

/**
 * These are the fixes tiles which cannot be moved
 */
export const fixedTiles: readonly (TileProps & FixedTileCoordinates)[] = [
  { type: "L", rotation: 90, content: <StartingTileMemoized color="green" />, x: 0, y: 0 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="cow" />, x: 2, y: 0 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="raccoon" />, x: 4, y: 0 },
  { type: "L", rotation: 180, content: <StartingTileMemoized color="red" />, x: 6, y: 0 },
  { type: "T", rotation: 90, content: <ItemTileMemoized item="candles" />, x: 0, y: 2 },
  { type: "T", rotation: 90, content: <ItemTileMemoized item="chest" />, x: 2, y: 2 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="crown" />, x: 4, y: 2 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="book" />, x: 6, y: 2 },
  { type: "T", rotation: 90, content: <ItemTileMemoized item="armor" />, x: 0, y: 4 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="emerald" />, x: 2, y: 4 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="keys" />, x: 4, y: 4 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="crab" />, x: 6, y: 4 },
  { type: "L", rotation: 0, content: <StartingTileMemoized color="blue" />, x: 0, y: 6 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="sword" />, x: 2, y: 6 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="skull" />, x: 4, y: 6 },
  { type: "L", rotation: 270, content: <StartingTileMemoized color="yellow" />, x: 6, y: 6 },
];

/**
 * All the other tiles which can me moved and rotated
 * Note that one is left out for the player
 */
export const movableTiles: readonly Omit<TileProps, "rotation">[] = [
  { type: "T", content: <ItemTileMemoized item="wildboar" /> },
  { type: "T", content: <ItemTileMemoized item="squirrel" /> },
  { type: "T", content: <ItemTileMemoized item="dragon" /> },
  { type: "T", content: <ItemTileMemoized item="bat" /> },
  { type: "T", content: <ItemTileMemoized item="moose" /> },
  { type: "T", content: <ItemTileMemoized item="bunny" /> },
  { type: "T" }, // hmm is this the correct one? count them...

  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "I" },
  { type: "X" },
  { type: "X" },
  { type: "X" },

  { type: "L", content: <ItemTileMemoized item="crocodile" /> },
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
