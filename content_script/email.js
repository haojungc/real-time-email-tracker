(() => {
    /** 
     * Ensures this script is injected into 
     * the same page only once
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function getDrafts() {
        return [...document.querySelectorAll("div[role='region']")];
    }

    function getThreadIdFromDraft(draft) {
        return draft.querySelector(`input[name="rt"]`).value;
    }

    function getMessageIdFromDraft(draft) {
        return draft.querySelector(`input[name="draft"]`).value;
    }

    function addTrackerToSendButton() {
        const drafts = getDrafts();
        if (!drafts || !drafts.length) {
            return;
        }

        // Add tracker to each draft
        drafts.forEach(draft => {
            const threadId = getThreadIdFromDraft(draft);
            const messageId = getMessageIdFromDraft(draft);
            const threadAttr = "data-thread-id";
            const messageAttr = "data-message-id";
            const sendButton = draft.querySelector("td.gU.Up div.dC").firstElementChild;

            // Skips if attributes exist
            if (sendButton.getAttribute(threadAttr) === threadId &&
                sendButton.getAttribute(messageAttr) === messageId
            ) {
                return;
            }

            sendButton.setAttribute(threadAttr, threadId);
            sendButton.setAttribute(messageAttr, messageId);
            console.log(`Added tracker for ${messageId} (${threadId})`);
        });
    }

    browser.runtime.onMessage.addListener((message) => {
        const threadIds = getThreadIds();
        return Promise.resolve(threadIds);
    });

    const interval = 1000;
    setInterval(addTrackerToSendButton, interval);
})();
