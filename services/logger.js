// API Request Logger and Monitor
class APILogger {
  constructor() {
    this.requests = new Map();
    this.maxLogSize = 100; // Keep last 100 requests
    this.enableLogging = process.env.NODE_ENV === 'development';
  }

  // Log request start
  logRequest(requestId, config) {
    if (!this.enableLogging) return;

    const logEntry = {
      id: requestId,
      method: config.method?.toUpperCase(),
      url: config.url,
      startTime: Date.now(),
      status: 'pending',
      data: config.data ? JSON.stringify(config.data).length : 0,
    };

    this.requests.set(requestId, logEntry);
    this.cleanup();
  }

  // Log request completion
  logResponse(requestId, response, error = null) {
    if (!this.enableLogging) return;

    const logEntry = this.requests.get(requestId);
    if (!logEntry) return;

    const endTime = Date.now();
    const duration = endTime - logEntry.startTime;

    Object.assign(logEntry, {
      endTime,
      duration,
      status: error ? 'error' : 'success',
      statusCode: response?.status || error?.status || 0,
      responseSize: response?.data ? JSON.stringify(response.data).length : 0,
      error: error ? {
        message: error.message,
        type: error.name,
        status: error.status,
      } : null,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = error ? '❌' : '✅';
      const statusCode = response?.status || error?.status || 'N/A';
      console.log(`${emoji} [${requestId}] ${logEntry.method} ${logEntry.url} - ${statusCode} (${duration}ms)`);
    }
  }

  // Get request logs
  getLogs(filter = {}) {
    const logs = Array.from(this.requests.values());
    
    if (filter.status) {
      return logs.filter(log => log.status === filter.status);
    }
    
    if (filter.method) {
      return logs.filter(log => log.method === filter.method.toUpperCase());
    }
    
    if (filter.lastN) {
      return logs.slice(-filter.lastN);
    }
    
    return logs.sort((a, b) => b.startTime - a.startTime);
  }

  // Get performance stats
  getStats() {
    const logs = Array.from(this.requests.values());
    const completed = logs.filter(log => log.duration);
    
    if (completed.length === 0) {
      return { total: logs.length, completed: 0 };
    }

    const durations = completed.map(log => log.duration);
    const errors = logs.filter(log => log.status === 'error');
    const successes = logs.filter(log => log.status === 'success');

    return {
      total: logs.length,
      completed: completed.length,
      pending: logs.length - completed.length,
      errors: errors.length,
      successes: successes.length,
      errorRate: (errors.length / completed.length * 100).toFixed(2) + '%',
      avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    };
  }

  // Cleanup old logs
  cleanup() {
    if (this.requests.size > this.maxLogSize) {
      const entries = Array.from(this.requests.entries());
      const toDelete = entries
        .sort((a, b) => a[1].startTime - b[1].startTime)
        .slice(0, this.requests.size - this.maxLogSize);
      
      toDelete.forEach(([id]) => this.requests.delete(id));
    }
  }

  // Clear all logs
  clear() {
    this.requests.clear();
  }

  // Export logs as JSON
  export() {
    return {
      timestamp: new Date().toISOString(),
      stats: this.getStats(),
      logs: this.getLogs(),
    };
  }
}

// Export singleton instance
export const apiLogger = new APILogger();

// Performance monitor
export const performanceMonitor = {
  // Track slow requests
  getSlowRequests(threshold = 3000) {
    return apiLogger.getLogs()
      .filter(log => log.duration && log.duration > threshold)
      .sort((a, b) => b.duration - a.duration);
  },

  // Track error patterns
  getErrorPatterns() {
    const errors = apiLogger.getLogs({ status: 'error' });
    const patterns = {};

    errors.forEach(error => {
      const key = `${error.statusCode || 'Network'} - ${error.error?.message || 'Unknown'}`;
      patterns[key] = (patterns[key] || 0) + 1;
    });

    return Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .map(([pattern, count]) => ({ pattern, count }));
  },

  // Get endpoint performance
  getEndpointPerformance() {
    const logs = apiLogger.getLogs().filter(log => log.duration);
    const endpoints = {};

    logs.forEach(log => {
      const key = `${log.method} ${log.url}`;
      if (!endpoints[key]) {
        endpoints[key] = [];
      }
      endpoints[key].push(log.duration);
    });

    return Object.entries(endpoints).map(([endpoint, durations]) => ({
      endpoint,
      calls: durations.length,
      avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    })).sort((a, b) => b.avgDuration - a.avgDuration);
  },
};
