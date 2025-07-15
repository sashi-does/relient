
import { createContext } from "react";

interface DialogContext {
    dialogOpen?: boolean,
    setDialogOpen?: ((args: boolean) => boolean) | undefined
}

export const ContextProvider = createContext<DialogContext>({});