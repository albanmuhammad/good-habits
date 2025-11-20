// lib/salesforce-tracking-simple.ts
import type { HabitCompletedEvent, SalesforceEventPayload } from '@/types/salesforce'

// lib/salesforce-tracking-simple.ts
export const trackHabitCompleted = (data: HabitCompletedEvent): boolean => {
  if (typeof window === 'undefined' || !window.SalesforceInteractions?.sendEvent) {
    console.warn('⚠️ SalesforceInteractions belum siap');
    return false;
  }

  try {
    const eventData: SalesforceEventPayload = {
      eventType: "habitCompleted",
      interaction: {
        name: "Habit Completed",
        eventType: "habitCompleted",
        category: "Engagement", 
        habitId: data.habitId,
        habitName: data.habitName,
        userId: data.userId! ?? null
      },
      user: data.userId ? { userId: data.userId } : undefined,
      source: {
        pageType: "habitTrackerPage",
        url: typeof window !== "undefined" ? window.location.href : "",
        urlReferrer: typeof document !== "undefined" ? document.referrer : "",
        channel: "Web"
      }
    };

    console.log('📤 Sending event to Salesforce:', eventData);
    window.SalesforceInteractions.sendEvent(eventData);
    console.log('✅ Event sent via sendEvent()');

    return true;
  } catch (e) {
    console.error('❌ Error sending habit completed event:', e);
    return false;
  }
};


interface BeaconPayload {
  event: SalesforceEventPayload
}

// Send via Navigator Beacon API
function sendViaBeacon(data: BeaconPayload): void {
  if (!navigator.sendBeacon) return;

  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json'
  });

  navigator.sendBeacon('/api/salesforce-track', blob);
}


function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  try {
    let sessionId = sessionStorage.getItem('sf_sessionId')
    
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('sf_sessionId', sessionId)
    }
    
    return sessionId
  } catch {
    return 'session_unknown'
  }
}

function getDeviceId(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  try {
    let deviceId = localStorage.getItem('sf_deviceId')
    
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('sf_deviceId', deviceId)
    }
    
    return deviceId
  } catch {
    return 'device_unknown'
  }
}

export const isSalesforceLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.SalesforceInteractions
}