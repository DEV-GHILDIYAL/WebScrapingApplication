/**
 * Mock Analytics Service
 * In a real app, this would integrate with Google Analytics, Mixpanel, or PostHog.
 */

export const analyticsService = {
  /**
   * Track page views
   */
  trackPageView(path: string) {
    // Hidden from console as per requirements
    // In production: send to AWS Kinesis or Analytics endpoint
    this._sendToMockBackend('page_view', { path, timestamp: new Date().toISOString() });
  },

  /**
   * Track custom events
   */
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    this._sendToMockBackend(eventName, { 
      ...properties, 
      timestamp: new Date().toISOString() 
    });
  },

  /**
   * Internal mock transporter
   */
  _sendToMockBackend(type: string, data: any) {
    if (typeof window !== 'undefined') {
      // Simulate network overhead for analytics
      const analyticsBuffer = JSON.parse(localStorage.getItem('sf_analytics_buffer') || '[]');
      analyticsBuffer.push({ type, ...data });
      
      // Keep only last 50 events in buffer
      const newBuffer = analyticsBuffer.slice(-50);
      localStorage.setItem('sf_analytics_buffer', JSON.stringify(newBuffer));
    }
  }
};
