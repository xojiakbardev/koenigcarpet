import useApi from "./useApi"

export const useAPIClient = (withToken = false ) => {
  const api = useApi(withToken)

  return {
    get: async <T = any>(url: string, params?: any): Promise<T> => {
      const { data } = await api.get<T>(url, { params })
      return data
    },
    post: async <T = any>(url: string, body?: any): Promise<T> => {
      const { data } = await api.post<T>(url, body)
      return data
    },
    put: async <T = any>(url: string, body?: any): Promise<T> => {
      const { data } = await api.put<T>(url, body)
      return data
    },
    del: async <T = any>(url: string): Promise<T> => {
      const { data } = await api.delete<T>(url)
      return data
    },
  }
}