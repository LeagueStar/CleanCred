/* ==========================================================================
   GREEN LEGACY — UTILITY FORMATTERS
   Points Conversion Rule: 100 Green Credits (GC) = ₹10 (INR)
   ========================================================================== */

export const Formatters = {
  /**
   * Convert Green Credits to Indian Rupees (INR)
   * 100 GC = ₹10
   */
  gpToInr(gp) {
    return Math.floor((gp / 100) * 10);
  },

  /**
   * Convert INR to Green Credits
   * ₹10 = 100 GC
   */
  inrToGp(inr) {
    return inr * 10;
  },

  /**
   * Format number with comma separators (Indian system)
   */
  formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-IN');
  },

  /**
   * Format Currency (₹)
   */
  formatCurrency(amount) {
    return `₹${this.formatNumber(amount)}`;
  },

  /**
   * Format Date nicely (e.g., "31 Aug 2026, 02:45 PM")
   */
  formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Format Relative Time (e.g. "10 mins ago", "Just now")
   */
  formatRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  },

  /**
   * Generate Request ID format: GK-2026-XXXXX
   */
  generateRequestId() {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    return `GK-${year}-${randomSuffix}`;
  }
};
