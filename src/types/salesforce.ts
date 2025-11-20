export interface HabitCompletedEvent {
  habitId: string
  habitName: string
  userId?: string
}

/**
 * EVENT yang dikirim ke Salesforce Interactions
 */
// types/salesforce.ts
export interface SalesforceEventPayload {
  eventType: string
  interaction: {
    name: string
    eventType: string
    category: string

    // untuk Habit Completed
    habitId?: string
    habitName?: string

    // untuk Email Button Converted
    emailId?: string
    jobId?: string
    actionId?: string

    // umum
    userId?: string
  }
  user?: {
    userId?: string
    anonymousId?: string
  }
  source?: {
    pageType?: string
    url?: string
    urlReferrer?: string
    channel?: string
  }
}


/**
 * Config untuk init()
 */
export interface SalesforceInitConfig {
  debug?: boolean
  orgId: string
  datasetId: string
  endpoint: string
  cookieDomain?: string
  lazyLoad?: boolean
}

/**
 * Config untuk initSitemap()
 */
export interface SalesforceSitemapObject {
  pageType: string
  urls: string[]
}

/**
 * Interfacenya SalesforceInteractions
 */
export interface SalesforceInteractionsSDK {
  sendEvent: (event: SalesforceEventPayload) => void
  getSessionId: () => string
  setLoggingLevel: (level: "debug" | "info" | "warn" | "error") => void
  init: (config: SalesforceInitConfig) => Promise<void>
  initSitemap: (config: SalesforceSitemapObject[]) => void
}

/**
 * CONSENTS type (tanpa any)
 */
export interface SalesforceConsentRecord {
  name: string
  value: boolean
}

/**
 * Extend window
 */
declare global {
  interface Window {
    SalesforceInteractions?: SalesforceInteractionsSDK
    CONSENTS?: SalesforceConsentRecord[]
  }
}

export interface SalesforceConsentRecord {
  name: string
  value: boolean
}

export interface SalesforceInteractionsSDK {
  sendEvent: (event: SalesforceEventPayload) => void
  getSessionId: () => string
  setLoggingLevel: (level: "debug" | "info" | "warn" | "error") => void
  init: (config: SalesforceInitConfig) => Promise<void>
  initSitemap: (config: SalesforceSitemapObject[]) => void
  // 👇 tambahin ini
  getConsents?: () => SalesforceConsentRecord[]
}

declare global {
  interface Window {
    SalesforceInteractions?: SalesforceInteractionsSDK
    CONSENTS?: SalesforceConsentRecord[]
  }
}

