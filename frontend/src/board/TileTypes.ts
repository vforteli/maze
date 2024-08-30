export const directions = [0, 90, 180, 270] as const;
export type Direction = (typeof directions)[number];

export const TileTypes: Record<TileType, Direction[]> = {
  T: [0, 90, 270],
  L: [0, 90],
  I: [90, 270],
  X: [0, 90, 180, 270], // yeap, this is not according to specs :D
};

export type TileType = "T" | "L" | "I" | "X";
