/**
 * Utility Functions Module
 * Reusable helper functions
 */


const Utils = {
    /**
     * Safely query a DOM element
     * @param {string} selector - CSS selector
     * @returns {Element|null}
     */
    $(selector) {
        return document.querySelector(selector);
    },
    
    /**
     * Query all matching DOM elements
     * @param {string} selector - CSS selector
     * @returns {NodeList}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    /**
     * Add event listener with error handling
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    on(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler);
        }
    },
    
    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function}
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function}
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Local Storage wrapper with error handling
     */
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage error:', e);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        },
        
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        }
    },
    
    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string}
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * Validate calculation result
     * @param {number} userAnswer - User's answer
     * @param {number} correctAnswer - Correct answer
     * @param {number} tolerance - Acceptable difference
     * @returns {boolean}
     */
    validateCalculation(userAnswer, correctAnswer, tolerance = 0.01) {
        return Math.abs(parseFloat(userAnswer) - correctAnswer) < tolerance;
    },
    
    /**
     * Show feedback message
     * @param {Element} element - Target element
     * @param {string} message - Message to display
     * @param {string} type - Message type (success, error, info)
     */
    showFeedback(element, message, type = 'info') {
        if (!element) return;
        
        element.textContent = message;
        element.className = `form-feedback ${type}`;
        
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };
        
        element.style.color = colors[type] || colors.info;
    },
    
    /**
     * Smooth scroll to element
     * @param {string|Element} target - Target element or selector
     * @param {number} offset - Offset from top
     */
    scrollTo(target, offset = 80) {
        const element = typeof target === 'string' ? this.$(target) : target;
        if (!element) return;
        
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    },
    
    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean}
     */
    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    /**
     * Get current breakpoint
     * @returns {string}
     */
    getBreakpoint() {
        const width = window.innerWidth;
        if (width < 480) return 'sm';
        if (width < 768) return 'md';
        if (width < 1024) return 'lg';
        return 'xl';
    },
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>}
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            console.error('Clipboard error:', e);
            return false;
        }
    }
};


// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
