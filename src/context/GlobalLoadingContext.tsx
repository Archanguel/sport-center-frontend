import { createContext, useContext, useState } from "react"

interface GlobalLoadingContextType {
  loadingCount: number
  startLoading: () => void
  stopLoading: () => void
  isLoading: boolean
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | null>(null)

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0)

  const startLoading = () => setLoadingCount(c => c + 1)
  const stopLoading = () => setLoadingCount(c => Math.max(0, c - 1))

  return (
    <GlobalLoadingContext.Provider
      value={{
        loadingCount,
        startLoading,
        stopLoading,
        isLoading: loadingCount > 0,
      }}
    >
      {children}
    </GlobalLoadingContext.Provider>
  )
}

export function useGlobalLoading() {
  const ctx = useContext(GlobalLoadingContext)
  if (!ctx) {
    throw new Error("useGlobalLoading must be used inside GlobalLoadingProvider")
  }
  return ctx
}
