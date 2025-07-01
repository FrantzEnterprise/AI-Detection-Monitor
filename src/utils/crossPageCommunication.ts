// Cross-page communication utility for floating widget
export class CrossPageCommunication {
  private static instance: CrossPageCommunication
  private broadcastChannel: BroadcastChannel
  private listeners: Map<string, Function[]> = new Map()

  private constructor() {
    this.broadcastChannel = new BroadcastChannel('ai-detector-widget')
    this.broadcastChannel.addEventListener('message', this.handleMessage.bind(this))
  }

  static getInstance(): CrossPageCommunication {
    if (!CrossPageCommunication.instance) {
      CrossPageCommunication.instance = new CrossPageCommunication()
    }
    return CrossPageCommunication.instance
  }

  private handleMessage(event: MessageEvent) {
    const { type, data } = event.data
    const callbacks = this.listeners.get(type) || []
    callbacks.forEach(callback => callback(data))
  }

  // Send message to all tabs/pages
  broadcast(type: string, data: any) {
    this.broadcastChannel.postMessage({ type, data })
  }

  // Listen for specific message types
  on(type: string, callback: Function) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type)!.push(callback)
  }

  // Remove listener
  off(type: string, callback: Function) {
    const callbacks = this.listeners.get(type) || []
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  // Clean up
  destroy() {
    this.broadcastChannel.close()
    this.listeners.clear()
  }
}

// Widget state management across pages
export class WidgetStateManager {
  private static readonly STORAGE_KEY = 'ai-detector-widget-state'
  
  static saveState(state: {
    isMonitoring: boolean
    isMinimized: boolean
    position: { x: number; y: number }
    currentAnalysis: any
    monitoringDisabled: boolean
  }) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      ...state,
      timestamp: Date.now()
    }))
    
    // Broadcast state change to all tabs
    const comm = CrossPageCommunication.getInstance()
    comm.broadcast('state-update', state)
  }

  static loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const state = JSON.parse(stored)
      // State expires after 1 hour of inactivity
      if (Date.now() - state.timestamp > 3600000) {
        this.clearState()
        return null
      }
      
      return state
    } catch {
      return null
    }
  }

  static clearState() {
    localStorage.removeItem(this.STORAGE_KEY)
    
    // Broadcast state clear to all tabs
    const comm = CrossPageCommunication.getInstance()
    comm.broadcast('state-cleared', {})
  }

  static isMonitoringDisabled(): boolean {
    const state = this.loadState()
    return state?.monitoringDisabled || false
  }

  static setMonitoringDisabled(disabled: boolean) {
    const currentState = this.loadState() || {
      isMonitoring: false,
      isMinimized: false,
      position: { x: 20, y: 20 },
      currentAnalysis: null,
      monitoringDisabled: false
    }
    
    this.saveState({
      ...currentState,
      monitoringDisabled: disabled,
      isMonitoring: disabled ? false : currentState.isMonitoring
    })
  }

  static updateMonitoringState(isMonitoring: boolean) {
    const currentState = this.loadState() || {
      isMonitoring: false,
      isMinimized: false,
      position: { x: 20, y: 20 },
      currentAnalysis: null,
      monitoringDisabled: false
    }
    
    this.saveState({
      ...currentState,
      isMonitoring,
      monitoringDisabled: !isMonitoring && currentState.monitoringDisabled
    })
  }

  static getMonitoringState(): { isMonitoring: boolean; monitoringDisabled: boolean } {
    const state = this.loadState()
    return {
      isMonitoring: state?.isMonitoring || false,
      monitoringDisabled: state?.monitoringDisabled || false
    }
  }
}
