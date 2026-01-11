import { useReducer } from "react"

type Action<T> =
  | { type: "SET"; payload: Partial<T> }
  | { type: "RESET"; payload: T }

function reducer<T>(state: T, action: Action<T>): T {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload }
    case "RESET":
      return action.payload
    default:
      return state
  }
}

export function useForm<T>(initial: T) {
  const [state, dispatch] = useReducer(reducer<T>, initial)

  function set(values: Partial<T>) {
    dispatch({ type: "SET", payload: values })
  }

  function reset(values: T) {
    dispatch({ type: "RESET", payload: values })
  }

  return { form: state, set, reset }
}
