import { describe, expect, test, vi } from "vitest";
import { BoardState, getNeighbours, getRandomBoardTiles, getRotatedDirections, moveTiles, rotatePlayerTile, rotateRight } from "./boardUtils";
import * as utils from "../utils";

const createMockBoardState = (): BoardState => ({
  playerTile: { id: 0, rotation: 180, type: "L" },
  tiles: [
    [
      { id: 1, rotation: 0, type: "T" },
      { id: 2, rotation: 0, type: "T" },
      { id: 3, rotation: 0, type: "T" },
    ],
    [
      { id: 4, rotation: 0, type: "I" },
      { id: 5, rotation: 0, type: "I" },
      { id: 6, rotation: 0, type: "I" },
    ],
    [
      { id: 7, rotation: 0, type: "L" },
      { id: 8, rotation: 0, type: "L" },
      { id: 9, rotation: 0, type: "L" },
    ],
  ],
});

describe("moveTiles", () => {
  test("moveRight", () => {
    const actual = moveTiles(createMockBoardState(), 1, "right");
    expect(actual).toMatchSnapshot();
  });

  test("moveLeft", () => {
    const actual = moveTiles(createMockBoardState(), 1, "left");
    expect(actual).toMatchSnapshot();
  });

  test("moveUp", () => {
    const actual = moveTiles(createMockBoardState(), 1, "up");
    expect(actual).toMatchSnapshot();
  });

  test("moveDown", () => {
    const actual = moveTiles(createMockBoardState(), 1, "down");
    expect(actual).toMatchSnapshot();
  });
});

describe("rotatePlayerTile", () => {
  test("rotate", () => {
    const board = createMockBoardState();

    expect(rotatePlayerTile(board).playerTile.rotation).toEqual(270);
  });
});

describe("rotateRight", () => {
  test("rotate", () => {
    expect(rotateRight(0)).toEqual(90);
    expect(rotateRight(90)).toEqual(180);
    expect(rotateRight(180)).toEqual(270);
    expect(rotateRight(270)).toEqual(0);
  });
});

vi.mock("../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils")>();

  return {
    ...actual,
    getRandomInteger: vi.fn(),
    shuffleArray: vi.fn(),
  };
});

describe("getRandomBoardTiles", () => {
  test("get board", () => {
    vi.mocked(utils.getRandomInteger).mockReturnValue(2);
    vi.mocked(utils.shuffleArray).mockImplementation((array: readonly unknown[]) => [...array]);

    const actual = getRandomBoardTiles();

    expect(actual).toMatchSnapshot();
  });
});

describe("getRotatedDirections", () => {
  test("rotate 0", () => {
    expect(getRotatedDirections({ rotation: 0, type: "I" })).toEqual([90, 270]);
  });

  test("rotate 90", () => {
    expect(getRotatedDirections({ rotation: 90, type: "I" })).toEqual([180, 0]);
  });

  test("rotate 180", () => {
    expect(getRotatedDirections({ rotation: 180, type: "I" })).toEqual([270, 90]);
  });

  test("rotate 270", () => {
    expect(getRotatedDirections({ rotation: 270, type: "I" })).toEqual([0, 180]);
  });
});

describe("getNeighbours", () => {
  test("top left", () => {
    expect(getNeighbours({ x: 0, y: 0 }, 3, 3)).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ]);
  });

  test("top middle", () => {
    expect(getNeighbours({ x: 1, y: 0 }, 3, 3)).toEqual([
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 0 },
    ]);
  });

  test("top right", () => {
    expect(getNeighbours({ x: 2, y: 0 }, 3, 3)).toEqual([
      { x: 2, y: 1 },
      { x: 1, y: 0 },
    ]);
  });

  test("middle", () => {
    expect(getNeighbours({ x: 1, y: 1 }, 3, 3)).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  test("bottom left", () => {
    expect(getNeighbours({ x: 0, y: 2 }, 3, 3)).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 2 },
    ]);
  });

  test("bottom right", () => {
    expect(getNeighbours({ x: 2, y: 2 }, 3, 3)).toEqual([
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ]);
  });

  test("bottom middle", () => {
    expect(getNeighbours({ x: 1, y: 2 }, 3, 3)).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  test("left middle", () => {
    expect(getNeighbours({ x: 0, y: 1 }, 3, 3)).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
    ]);
  });

  test("right middle", () => {
    expect(getNeighbours({ x: 2, y: 1 }, 3, 3)).toEqual([
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
    ]);
  });
});
