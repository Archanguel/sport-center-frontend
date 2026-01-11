import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/globals.css"
import App from "./App"

const container = document.getElementById("root")
//document.documentElement.classList.add("dark")
if (!container) {
  throw new Error("Root container missing in index.html")
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
