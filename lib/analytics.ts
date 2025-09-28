// Minimal GA4 helper (expects gtag to be present in layout)
export type GAParams = Record<string, string|number|boolean|undefined>
export const gaEvent = (name: string, params: GAParams = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w?.gtag) w.gtag('event', name, params)
}

// Specific tracking functions for home page
export function trackHomeHubClick(section: string, target: string) {
  gaEvent('home_hub_click', {
    section,
    target
  });
}

export function trackNewsItemClick(title: string, source: string) {
  gaEvent('news_item_click', {
    news_title: title,
    news_source: source
  });
}
