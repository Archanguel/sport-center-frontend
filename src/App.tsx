import type { ReactElement } from "react";
import AppRouter from "./router/AppRouter"
import { TooltipProvider } from "./components/ui/tooltip"

export default function App(): ReactElement {
  return (
    <TooltipProvider delayDuration={200}>
      <AppRouter />
    </TooltipProvider>
  )
}
