"use client"

import { testAction } from "./action"

export const ClientComponent = () => {
  return <button onClick={() => testAction({}).then(JSON.stringify).then(alert)}>Test</button>
}
