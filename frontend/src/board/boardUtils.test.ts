import { describe, expect, test } from "vitest";
import { BoardState, moveTiles, rotatePlayerTile, rotateRight } from "./boardUtils";

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
