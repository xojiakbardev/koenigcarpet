import { createContext } from "react";
import { UserSession } from "@/types/session";

export type SessionContextType = {
  session: UserSession;
  setSession: (session: UserSession) => void;
}

export const SessionContext = createContext<SessionContextType | null>(null);
