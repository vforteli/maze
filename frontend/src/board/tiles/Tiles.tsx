import { TileProps } from "./Tile";
import { ItemTileMemoized } from "./ItemTile";
import { StartingTileMemoized } from "./StartingTile";
import {
  BatIcon,
  BearIcon,
  BunnyIcon,
  CatIcon,
  CowIcon,
  CrabIcon,
  CrocodileIcon,
  FoxIcon,
  FrogIcon,
  HedgehogIcon,
  JellyFishIcon,
  LionIcon,
  MooseIcon,
  PenguinIcon,
  PolarBearIcon,
  RaccoonIcon,
  ShrimpIcon,
  SpiderIcon,
  SquirrelIcon,
  TrexIcon,
  TurtleIcon,
  WhaleIcon,
  WildBoarIcon,
  ZebraIcon,
} from "../../assets/Icons";

export const things = [
  "cow",
  "wildboar",
  "raccoon",
  "squirrel",
  "lion",
  "trex",
  "bunny",
  "fox",
  "hedgehog",
  "penguin",
  "shrimp",
  "crocodile",
  "cat",
  "spider",
  "frog",
  "whale",
  "zebra",
  "bear",
  "crab",
  "moose",
  "polarbear",
  "turtle",
  "jellyfish",
  "bat",
] as const;

export type Thing = (typeof things)[number];

export type FixedTileCoordinates = {
  x: number;
  y: number;
};

export const ThingIcons: Record<Thing, React.ReactElement> = {
  crocodile: <CrocodileIcon width={70} height={70} />,
  bunny: <BunnyIcon width={70} height={70} />,
  cow: <CowIcon width={70} height={70} />,
  moose: <MooseIcon width={70} height={70} />,
  wildboar: <WildBoarIcon width={70} height={70} />,
  raccoon: <RaccoonIcon width={70} height={70} />,
  squirrel: <SquirrelIcon width={70} height={70} />,
  crab: <CrabIcon width={70} height={70} />,
  fox: <FoxIcon width={70} height={70} />,
  whale: <WhaleIcon width={70} height={70} />,
  penguin: <PenguinIcon width={70} height={70} />,
  lion: <LionIcon width={70} height={70} />,
  hedgehog: <HedgehogIcon width={70} height={70} />,
  trex: <TrexIcon width={70} height={70} />,
  shrimp: <ShrimpIcon width={70} height={70} />,
  cat: <CatIcon width={40} height={40} />,
  spider: <SpiderIcon width={50} height={50} />,
  frog: <FrogIcon width={40} height={40} />,
  polarbear: <PolarBearIcon width={70} height={70} />,
  jellyfish: <JellyFishIcon width={70} height={70} />,
  zebra: <ZebraIcon width={70} height={70} />,
  bear: <BearIcon width={70} height={70} />,
  turtle: <TurtleIcon width={70} height={70} />,
  bat: <BatIcon width={70} height={70} />,
};

/**
 * These are the fixed tiles which cannot be moved
 */
export const fixedTiles: readonly (TileProps & FixedTileCoordinates)[] = [
  { type: "L", rotation: 90, content: <StartingTileMemoized color="darkorange" />, x: 0, y: 0 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="cow" />, x: 2, y: 0 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="raccoon" />, x: 4, y: 0 },
  { type: "L", rotation: 180, content: <StartingTileMemoized color="magenta" />, x: 6, y: 0 },

  { type: "T", rotation: 90, content: <ItemTileMemoized item="fox" />, x: 0, y: 2 },
  { type: "T", rotation: 90, content: <ItemTileMemoized item="hedgehog" />, x: 2, y: 2 },
  { type: "T", rotation: 180, content: <ItemTileMemoized item="penguin" />, x: 4, y: 2 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="shrimp" />, x: 6, y: 2 },

  { type: "T", rotation: 90, content: <ItemTileMemoized item="whale" />, x: 0, y: 4 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="zebra" />, x: 2, y: 4 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="bear" />, x: 4, y: 4 },
  { type: "T", rotation: 270, content: <ItemTileMemoized item="crab" />, x: 6, y: 4 },

  { type: "L", rotation: 0, content: <StartingTileMemoized color="cyan" />, x: 0, y: 6 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="turtle" />, x: 2, y: 6 },
  { type: "T", rotation: 0, content: <ItemTileMemoized item="jellyfish" />, x: 4, y: 6 },
  { type: "L", rotation: 270, content: <StartingTileMemoized color="yellow" />, x: 6, y: 6 },
];

/**
 * All the other tiles which can me moved and rotated
 * Note that one is left out for the player
 */
export const movableTiles: readonly Omit<TileProps, "rotation">[] = [
  { type: "T", content: <ItemTileMemoized item="wildboar" /> },
  { type: "T", content: <ItemTileMemoized item="squirrel" /> },
  { type: "T", content: <ItemTileMemoized item="trex" /> },
  { type: "T", content: <ItemTileMemoized item="cat" /> },
  { type: "T", content: <ItemTileMemoized item="moose" /> },
  { type: "T", content: <ItemTileMemoized item="bunny" /> },

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
  { type: "X" },
  { type: "I" },
  { type: "I" },

  { type: "L", content: <ItemTileMemoized item="crocodile" /> },
  { type: "L", content: <ItemTileMemoized item="lion" /> },
  { type: "L", content: <ItemTileMemoized item="frog" /> },
  { type: "L", content: <ItemTileMemoized item="spider" /> },
  { type: "L", content: <ItemTileMemoized item="polarbear" /> },
  { type: "L", content: <ItemTileMemoized item="bat" /> },
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
