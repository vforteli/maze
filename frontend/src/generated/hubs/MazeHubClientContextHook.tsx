import { useContext } from "react";
import { MazeHubClientContext } from "./MazeHubClientContext";

export const useMazeHubClient = () => {
  const context = useContext(MazeHubClientContext);

  if (context === undefined) {
    throw Error("Context undefined? Forgot a provider somewhere?");
  }

  return context;
};
