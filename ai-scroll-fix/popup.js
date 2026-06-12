document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('ai-chat-count');
    const platformElement = document.getElementById('last-platform');
    const resetBtn = document.getElementById('reset-btn');

    function updateDisplay() {
        chrome.storage.sync.get(['aiChatCount', 'lastPlatform'], function(result) {
            const count = result.aiChatCount || 0;
            const platform = result.lastPlatform || 'None';
            
            counterElement.textContent = count;
            platformElement.textContent = `Last visited: ${platform}`;
        });
    }

    resetBtn.addEventListener('click', function() {
        chrome.storage.sync.set({ aiChatCount: 0 }, function() {
            updateDisplay();
        });
    });

    // Initial load
    updateDisplay();

    // Listen for changes
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync') {
            updateDisplay();
        }
    });
});
