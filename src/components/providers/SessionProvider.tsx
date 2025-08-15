"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserSession } from "@/types/session";
import { internalApi } from "@/lib/api";
import { isAxiosError } from "axios";
import { SessionContext } from "@/context/sessionContext";


type Props = {
  children: ReactNode
}

export const SessionProvider: FC<Props> = ({ children }) => {
  const [session, setSession] = useState<UserSession>(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await internalApi.get("/api/auth/session");
        setSession(session.data);
      }
      catch (error) {
        setSession(null);
        if (isAxiosError(error) && error.response?.status === 401) {
          await internalApi.post("/api/auth/logout")
          toast.error("Your session has been expired and you have been logged out")
        }
      }
    }
    fetchSession();
  }, [])
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};