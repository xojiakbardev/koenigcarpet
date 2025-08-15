import axios from "axios";
import { useEffect } from "react";
import { externalApi, internalApi } from "@/lib/api";
import { useSession } from "./useSession";

const useApi = (withToken = false) => {
    const { session, setSession } = useSession();

    useEffect(() => {
        const requestInterceptor = externalApi.interceptors.request.use(
            async(config) => {
                if (withToken) {
                    if (!session?.access_token) {
                        throw new axios.Cancel("Please register first");
                    }
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = externalApi.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response?.status === 401 &&
                    !originalRequest._retry &&
                    originalRequest.url !== "/api/auth/refresh"
                ) {
                    originalRequest._retry = true;
                    try {
                        if (session) {
                            const res = await internalApi.get("/api/auth/refresh");
                            setSession({ ...session, access_token: res.data.access_token });
                        }
                    } catch {
                        setSession(null);
                        await axios.post("/api/auth/logout");
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            externalApi.interceptors.request.eject(requestInterceptor);
            externalApi.interceptors.response.eject(responseInterceptor);
        };
    }, [session, setSession, withToken]); // -> withToken dependencyga qo'shildi

    return externalApi;
};

export default useApi;
