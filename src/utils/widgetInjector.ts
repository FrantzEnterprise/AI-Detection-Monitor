// Inject floating widget into monitored pages
export class WidgetInjector {
  private static injectedPages = new Set<string>()
  private static widgetInstances = new Map<string, HTMLElement>()
  
  static async injectIntoPage(url: string) {
    // For same-origin pages, inject directly
    if (this.isSameOrigin(url)) {
      return this.injectWidget(url)
    }

    // For cross-origin pages, we'll use a different approach
    // Since we can't directly inject into other domains, we'll create a system notification
    return this.createCrossOriginNotification(url)
  }

  private static isSameOrigin(url: string): boolean {
    try {
      const targetUrl = new URL(url)
      return targetUrl.origin === window.location.origin
    } catch {
      return false
    }
  }

  private static injectWidget(targetUrl: string) {
    const pageId = targetUrl
    if (this.injectedPages.has(pageId)) {
      // Update existing widget
      this.updateExistingWidget(pageId)
      return
    }

    // Create widget container
    const widgetContainer = document.createElement('div')
    widgetContainer.id = 'ai-detector-floating-widget'
    widgetContainer.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    `

    // Create the actual widget
    const widget = this.createWidgetElement()
    widgetContainer.appendChild(widget)
    
    document.body.appendChild(widgetContainer)
    this.injectedPages.add(pageId)
    this.widgetInstances.set(pageId, widgetContainer)

    // Listen for page navigation
    this.setupNavigationListener()

    // Setup cross-page communication
    this.setupCrossPageCommunication(widget)
  }

  private static createCrossOriginNotification(targetUrl: string) {
    // Create a notification that the widget will be available on the target page
    const notification = this.createSystemNotification(targetUrl)
    document.body.appendChild(notification)

    // Store the monitoring intent for when the user navigates to the target page
    this.storeMonitoringIntent(targetUrl)
  }

  private static createWidgetElement() {
    const widget = document.createElement('div')
    widget.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 320px !important;
      background: rgba(0, 0, 0, 0.9) !important;
      backdrop-filter: blur(20px) !important;
      border: 2px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 12px !important;
      color: white !important;
      font-size: 14px !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
      pointer-events: auto !important;
      z-index: 2147483647 !important;
      transition: all 0.3s ease !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    `

    widget.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; flex: 1;">
            <div style="width: 32px; height: 32px; background: rgba(59, 130, 246, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              🛡️
            </div>
            <div>
              <div style="font-weight: 600; font-size: 14px;">AI Detector</div>
              <div style="font-size: 12px; opacity: 0.7;" id="widget-status">Monitoring Active</div>
            </div>
          </div>
          <button id="widget-expand" style="padding: 6px; background: rgba(255, 255, 255, 0.1); border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 12px; margin-right: 4px;">
            ⛶
          </button>
          <button id="widget-close" style="padding: 6px; background: rgba(255, 255, 255, 0.1); border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 12px;">
            ✕
          </button>
        </div>
      </div>
      <div style="padding: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
          <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 8px; text-align: center;">
            <div style="font-size: 18px; font-weight: bold;" id="total-count">0</div>
            <div style="font-size: 10px; opacity: 0.7;">Total</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 8px; text-align: center;">
            <div style="font-size: 18px; font-weight: bold; color: #ef4444;" id="ai-count">0</div>
            <div style="font-size: 10px; opacity: 0.7;">AI Found</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 8px; text-align: center;">
            <div style="font-size: 18px; font-weight: bold; color: #10b981;" id="human-count">0</div>
            <div style="font-size: 10px; opacity: 0.7;">Human</div>
          </div>
        </div>
        <div id="detection-status" style="margin-bottom: 12px; min-height: 40px;">
          <div style="text-align: center; padding: 12px; opacity: 0.5; font-size: 12px;">
            Monitoring this page for AI content...
          </div>
        </div>
        <button id="widget-toggle" style="width: 100%; padding: 8px; background: #ef4444; border: none; border-radius: 6px; color: white; font-weight: 500; cursor: pointer; font-size: 12px;">
          Stop Monitoring
        </button>
      </div>
    `

    // Add event listeners
    this.setupWidgetEvents(widget)
    
    return widget
  }

  private static createSystemNotification(targetUrl: string) {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: rgba(0, 0, 0, 0.9) !important;
      color: white !important;
      padding: 16px !important;
      border-radius: 8px !important;
      border: 2px solid rgba(59, 130, 246, 0.5) !important;
      z-index: 2147483647 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-size: 14px !important;
      max-width: 300px !important;
      pointer-events: auto !important;
    `

    const domain = new URL(targetUrl).hostname

    notification.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="margin-right: 8px;">🛡️</span>
        <strong>AI Detector Ready</strong>
      </div>
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 12px;">
        Floating widget will appear when you visit ${domain}
      </div>
      <button onclick="this.parentElement.remove()" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.5); color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
        Got it
      </button>
    `

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 5000)

    return notification
  }

  private static setupWidgetEvents(widget: HTMLElement) {
    const expandBtn = widget.querySelector('#widget-expand')
    const closeBtn = widget.querySelector('#widget-close')
    const toggleBtn = widget.querySelector('#widget-toggle')
    const statusEl = widget.querySelector('#widget-status')

    expandBtn?.addEventListener('click', () => {
      // Send message to main app to expand
      const comm = CrossPageCommunication.getInstance()
      comm.broadcast('expand-widget', {})
    })

    closeBtn?.addEventListener('click', () => {
      // Remove widget and stop monitoring
      widget.parentElement?.remove()
      const comm = CrossPageCommunication.getInstance()
      comm.broadcast('stop-monitoring', {})
    })

    toggleBtn?.addEventListener('click', () => {
      // Toggle monitoring state
      const isActive = toggleBtn.textContent?.includes('Stop')
      if (isActive) {
        toggleBtn.textContent = 'Start Monitoring'
        toggleBtn.style.background = '#10b981'
        if (statusEl) statusEl.textContent = 'Monitoring Stopped'
      } else {
        toggleBtn.textContent = 'Stop Monitoring'
        toggleBtn.style.background = '#ef4444'
        if (statusEl) statusEl.textContent = 'Monitoring Active'
      }
      
      const comm = CrossPageCommunication.getInstance()
      comm.broadcast('toggle-monitoring', { active: !isActive })
    })

    // Make widget draggable
    this.makeWidgetDraggable(widget)

    // Start monitoring animation
    this.startMonitoringAnimation(widget)
  }

  private static makeWidgetDraggable(widget: HTMLElement) {
    let isDragging = false
    let currentX = 0
    let currentY = 0
    let initialX = 0
    let initialY = 0

    widget.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') return
      
      isDragging = true
      initialX = e.clientX - currentX
      initialY = e.clientY - currentY
      widget.style.cursor = 'grabbing'
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      
      e.preventDefault()
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY
      
      const maxX = window.innerWidth - widget.offsetWidth
      const maxY = window.innerHeight - widget.offsetHeight
      
      currentX = Math.max(0, Math.min(currentX, maxX))
      currentY = Math.max(0, Math.min(currentY, maxY))
      
      widget.style.right = 'auto'
      widget.style.bottom = 'auto'
      widget.style.left = currentX + 'px'
      widget.style.top = currentY + 'px'
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
      widget.style.cursor = 'move'
    })
  }

  private static startMonitoringAnimation(widget: HTMLElement) {
    const statusEl = widget.querySelector('#widget-status')
    const totalEl = widget.querySelector('#total-count')
    const aiEl = widget.querySelector('#ai-count')
    const humanEl = widget.querySelector('#human-count')
    
    // Simulate monitoring activity
    let totalCount = 0
    let aiCount = 0
    let humanCount = 0
    
    const updateCounts = () => {
      totalCount++
      if (Math.random() > 0.8) {
        aiCount++
      } else {
        humanCount++
      }
      
      if (totalEl) totalEl.textContent = totalCount.toString()
      if (aiEl) aiEl.textContent = aiCount.toString()
      if (humanEl) humanEl.textContent = humanCount.toString()
    }
    
    // Update every 3 seconds
    setInterval(updateCounts, 3000)
  }

  private static setupNavigationListener() {
    // Listen for page changes (SPA navigation)
    let currentUrl = window.location.href
    
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href
        // Check if we should inject widget on this new page
        this.checkForMonitoringIntent()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  private static setupCrossPageCommunication(widget: HTMLElement) {
    // Listen for messages from the main app
    const comm = CrossPageCommunication.getInstance()
    
    comm.on('update-stats', (data) => {
      const totalEl = widget.querySelector('#total-count')
      const aiEl = widget.querySelector('#ai-count')
      const humanEl = widget.querySelector('#human-count')
      
      if (totalEl) totalEl.textContent = data.total.toString()
      if (aiEl) aiEl.textContent = data.ai.toString()
      if (humanEl) humanEl.textContent = data.human.toString()
    })
    
    comm.on('detection-result', (data) => {
      const statusEl = widget.querySelector('#detection-status')
      if (statusEl && data.detected) {
        statusEl.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.1); border-radius: 6px; padding: 8px; font-size: 11px;">
            <div style="color: #ef4444; font-weight: 500;">⚠️ AI Content Detected</div>
            <div style="opacity: 0.8; margin-top: 2px;">${data.type} - ${data.confidence}% confidence</div>
          </div>
        `
      }
    })
  }

  private static storeMonitoringIntent(url: string) {
    localStorage.setItem('ai-detector-monitoring-intent', JSON.stringify({
      url,
      timestamp: Date.now()
    }))
  }

  private static checkForMonitoringIntent() {
    const intent = localStorage.getItem('ai-detector-monitoring-intent')
    if (!intent) return
    
    try {
      const { url, timestamp } = JSON.parse(intent)
      const currentUrl = window.location.href
      
      // Check if current page matches the intended monitoring target
      if (currentUrl.includes(new URL(url).hostname) && Date.now() - timestamp < 300000) { // 5 minutes
        // Inject widget on this page
        this.injectWidget(currentUrl)
        // Clear the intent
        localStorage.removeItem('ai-detector-monitoring-intent')
      }
    } catch (error) {
      console.error('Error checking monitoring intent:', error)
    }
  }

  private static updateExistingWidget(pageId: string) {
    const widget = this.widgetInstances.get(pageId)
    if (widget) {
      // Update widget state or refresh it
      const statusEl = widget.querySelector('#widget-status')
      if (statusEl) {
        statusEl.textContent = 'Monitoring Active'
      }
    }
  }

  static removeWidget(pageId?: string) {
    if (pageId) {
      const widget = this.widgetInstances.get(pageId)
      if (widget) {
        widget.remove()
        this.widgetInstances.delete(pageId)
        this.injectedPages.delete(pageId)
      }
    } else {
      // Remove all widgets
      this.widgetInstances.forEach(widget => widget.remove())
      this.widgetInstances.clear()
      this.injectedPages.clear()
    }
  }

  static isWidgetInjected(pageId: string): boolean {
    return this.injectedPages.has(pageId)
  }
}

// Import this for cross-page communication
import { CrossPageCommunication } from './crossPageCommunication'
