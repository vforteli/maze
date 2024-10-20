export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function chunkArray<T>(array: readonly T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}

export type ChainablePath = {
  path: string;
  options: KeyframeAnimationOptions;
};

/**
 * Helper function for animation many consecutive motion paths
 */
export async function animateMany(element: HTMLElement, paths: readonly ChainablePath[]) {
  const runAnimation = (path: ChainablePath): Promise<void> =>
    new Promise((resolve) => {
      element.style.offsetPath = path.path;
      element.animate([{ offsetDistance: "0%" }, { offsetDistance: "100%" }], path.options).addEventListener(
        "finish",
        () => {
          resolve();
        },
        { once: true },
      );
    });

  for (const path of paths) {
    await runAnimation(path);
  }
}
