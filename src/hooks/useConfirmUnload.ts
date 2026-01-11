import { useEffect } from "react"

export function useConfirmUnload(enabled: boolean, message = "Hay cambios sin guardar") {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = message
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [enabled, message])
}
