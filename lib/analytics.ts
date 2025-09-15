// Minimal GA4 helper (expects gtag to be present in layout)
export type GAParams = Record<string, string|number|boolean|undefined>
export const gaEvent = (name: string, params: GAParams = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w?.gtag) w.gtag('event', name, params)
}
