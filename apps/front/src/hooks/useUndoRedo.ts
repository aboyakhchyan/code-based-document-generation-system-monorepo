import { useState } from "react";

const DEFAULT_LIMIT_HISTORY = 20;

interface IUndoRedoOptions {
  limit?: number;
}

interface IUndoRedoParams<T> {
  currentState: T | null;
  mutator: React.Dispatch<React.SetStateAction<T | null>>;
  options: IUndoRedoOptions;
}

export const useUndoRedo = <T>({ currentState, mutator, options }: IUndoRedoParams<T>) => {
  const { limit = DEFAULT_LIMIT_HISTORY } = options;
  const cloneCurrentState = structuredClone(currentState);

  const [undoStack, setUndoStack] = useState<T[]>([]);
  const [redoStack, setRedoStack] = useState<T[]>([]);

  const handlePushToHistory = (data: T | null) => {
    setUndoStack((prev) => {
      if (data === null) return prev;
      const clonedData = structuredClone(data);
      const newUndoStack = [...prev, clonedData];
      if (newUndoStack.length > limit) {
        return newUndoStack.slice(1);
      }
      return newUndoStack;
    });
    setRedoStack([]);
  };

  const handleUndo = () => {
    const lastUndo = undoStack[undoStack.length - 1];
    if (lastUndo) {
      const clonedUndo = structuredClone(lastUndo);
      mutator(clonedUndo);
      setUndoStack((prev) => prev.slice(0, -1));
      setRedoStack((prev) => (prev && cloneCurrentState ? [...prev, cloneCurrentState] : prev));
    }
  };
  const handleRedo = () => {
    const lestRedo = redoStack[redoStack.length - 1];
    if (lestRedo) {
      const clonedRedo = structuredClone(lestRedo);
      mutator(clonedRedo);
      setRedoStack((prev) => prev.slice(0, -1));
      setUndoStack((prev) => (prev && cloneCurrentState ? [...prev, cloneCurrentState] : prev));
    }
  };

  return {
    undoStack,
    redoStack,
    handlePushToHistory,
    handleUndo,
    handleRedo,
  };
};
