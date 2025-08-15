import { SessionContext, SessionContextType } from "@/context/sessionContext";
import { useContext } from "react";

export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (!context) {throw new Error("useSession must be used within a SessionProvider")}
    return context;
};