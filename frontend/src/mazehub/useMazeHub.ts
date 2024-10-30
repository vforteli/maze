import { useContext } from "react";
import { MazeHubContext } from "./MazeHubContext";

export const useMazeHub = () => {
  const context = useContext(MazeHubContext);

  if (context === undefined) {
    throw Error("Context undefined? Forgot a provider somewhere?");
  }

  return context;
};
