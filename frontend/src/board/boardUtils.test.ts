import { describe, expect, test, vi } from "vitest";
import { BoardState, getRandomBoardTiles, moveTiles, rotatePlayerTile, rotateRight } from "./boardUtils";
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
