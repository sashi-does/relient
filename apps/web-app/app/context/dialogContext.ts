// app/context/dialogContext.tsx
"use client";

import { createContext, useContext } from "react";
import { Portal, User } from "@repo/types/interfaces";


export interface DialogContextProps {
  user: User | null;
  portals: Portal[];
}

export const DialogContext = createContext<DialogContextProps>({
  user: null,
  portals: [],
});

export const useDialogContext = () => useContext(DialogContext);
