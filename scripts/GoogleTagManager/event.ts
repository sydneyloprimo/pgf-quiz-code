type WindowWithDataLayer = Window & {
  dataLayer: Record<string, unknown>[]
}

type KeyValue = {
  [key: string]: unknown
}

declare const window: WindowWithDataLayer

const event = (event_name: string, ...rest: KeyValue[]) => {
  window.dataLayer.push({ event: event_name, ...rest })
}

export default event
