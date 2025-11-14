/**
 * Interactive Elements Component
 * Handles interactive calculations, validations, and feedback
 */

const Interactive = {
    /**
     * Initialize interactive elements
     */
    init() {
        this.setupCalculationChecks();
        this.setupBackToTop();
        this.setupCodeCopy();
        this.setupHints();
    },

    /**
     * Setup calculation validation
     */
    setupCalculationChecks() {
        const checkButtons = Utils.$$('.btn-check-answer');

        checkButtons.forEach(btn => {
            Utils.on(btn, 'click', () => {
                const inputId = btn.dataset.input;
                const feedbackId = btn.dataset.feedback;
                const correctAnswer = parseFloat(btn.dataset.answer);

                this.checkCalculation(inputId, correctAnswer, feedbackId);
            });
        });
    },

    /**
     * Check user's calculation
     * @param {string} inputId - Input element ID
     * @param {number} correctAnswer - Correct answer
     * @param {string} feedbackId - Feedback element ID
     */
    checkCalculation(inputId, correctAnswer, feedbackId) {
        const input = Utils.$(`#${inputId}`);
        const feedback = Utils.$(`#${feedbackId}`);

        if (!input || !feedback) return;

        const userAnswer = parseFloat(input.value);

        if (isNaN(userAnswer)) {
            Utils.showFeedback(feedback, '⚠️ Please enter a valid number', 'error');
            input.classList.add('is-invalid');
            return;
        }

        const isCorrect = Utils.validateCalculation(userAnswer, correctAnswer);

        if (isCorrect) {
            Utils.showFeedback(feedback, '✅ Correct! Well done!', 'success');
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            this.celebrateSuccess(input);
        } else {
            const hint = Math.abs(userAnswer - correctAnswer) < 1
                ? 'Very close! Check your decimal places.'
                : `Try again. Hint: The answer is approximately ${correctAnswer.toFixed(3)}`;
            Utils.showFeedback(feedback, `❌ ${hint}`, 'error');
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    },

    /**
     * Celebrate correct answer with animation
     * @param {Element} element - Element to animate
     */
    celebrateSuccess(element) {
        element.style.transition = 'all 0.3s ease';
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    },

    /**
     * Setup back to top button
     */
    setupBackToTop() {
        const backToTop = Utils.$('.back-to-top');
        if (!backToTop) return;

        const toggleVisibility = Utils.throttle(() => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', toggleVisibility);

        Utils.on(backToTop, 'click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    /**
     * Setup code copy functionality
     */
    setupCodeCopy() {
        const codeBlocks = Utils.$$('.code-block');

        codeBlocks.forEach(block => {
            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn btn-sm btn-ghost code-copy-btn';
            copyBtn.innerHTML = '📋 Copy';
            copyBtn.style.cssText = 'position: absolute; top: 10px; right: 10px;';

            block.style.position = 'relative';
            block.appendChild(copyBtn);

            Utils.on(copyBtn, 'click', async () => {
                const code = block.querySelector('pre')?.textContent || block.textContent;
                const success = await Utils.copyToClipboard(code);

                if (success) {
                    copyBtn.innerHTML = '✅ Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋 Copy';
                    }, 2000);
                } else {
                    copyBtn.innerHTML = '❌ Failed';
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋 Copy';
                    }, 2000);
                }
            });
        });
    },

    /**
     * Setup hint toggles
     */
    setupHints() {
        const hintButtons = Utils.$$('.btn-show-hint');

        hintButtons.forEach(btn => {
            Utils.on(btn, 'click', () => {
                const hintId = btn.dataset.hint;
                const hint = Utils.$(`#${hintId}`);

                if (hint) {
                    hint.classList.toggle('hidden');
                    btn.textContent = hint.classList.contains('hidden')
                        ? '💡 Show Hint'
                        : '🔒 Hide Hint';
                }
            });
        });
    },

    /**
     * Create interactive matrix
     * @param {Array} data - Matrix data
     * @param {string} containerId - Container element ID
     */
    createMatrix(data, containerId) {
        const container = Utils.$(`#${containerId}`);
        if (!container) return;

        const rows = data.length;
        const cols = data[0].length;

        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'matrix-container';

        const grid = document.createElement('div');
        grid.className = 'matrix-grid';
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        data.forEach(row => {
            row.forEach(value => {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = typeof value === 'number' ? value.toFixed(3) : value;
                grid.appendChild(cell);
            });
        });

        matrixDiv.appendChild(grid);
        container.appendChild(matrixDiv);
    },

    /**
     * Highlight matrix cells
     * @param {string} containerId - Container element ID
     * @param {Array} indices - Cell indices to highlight [[row, col], ...]
     */
    highlightMatrixCells(containerId, indices) {
        const container = Utils.$(`#${containerId}`);
        if (!container) return;

        const cells = container.querySelectorAll('.matrix-cell');

        indices.forEach(([row, col]) => {
            const index = row * cols + col;
            if (cells[index]) {
                cells[index].style.background = 'var(--primary-yellow)';
                cells[index].style.fontWeight = 'bold';
            }
        });
    }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Interactive.init());
} else {
    Interactive.init();
}
