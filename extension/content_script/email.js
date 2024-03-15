/* Test code */
console.log("======The extension is running======");
document.body.style.border = "5px solid red";

(() => {
    /* Ensures this script is injected into
     the same page only once */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    const fetchedThreadIds = new Map();
    const apiGatewayURL = "https://d7ccjmymx2.execute-api.us-west-1.amazonaws.com/default";

    function fetchMessageStatuses() {
        const threadSelector = "table.F.cf.zt tbody tr";
        const threadIdSelector = "td.xY.a4W span.bog span";
        const threadStatusSelector = "td.yf.xY";
        const getMessageStatusURL = `${apiGatewayURL}/threads`;

        const threadsToFetch = [...document.querySelectorAll(threadSelector)].filter(element => {
            const threadId = element.querySelector(threadIdSelector).getAttribute("data-thread-id");
            if (fetchedThreadIds.get(threadId)) {
                const threadStatus = element.querySelector(threadStatusSelector);
                /* TODO */
                if (threadStatus.innerText.length === 0) {
                    threadStatus.innerText = "second nice!";
                }

            }
            return !fetchedThreadIds.has(threadId);
        });

        if (threadsToFetch.length === 0) {
            return;
        }

        threadsToFetch.forEach(async (element) => {
            const threadId = element.querySelector(threadIdSelector).getAttribute("data-thread-id");
            const messageId = threadId.split(":")[1];

            //try {
                //console.log(`Fetching ${threadId}...`);
                //const response = await fetch(getMessageStatusURL);
                //if (!response.ok) {
                    //throw new Error("Network response was not OK");
                //}
                //const json = await response.json();
                //console.log(json);

                //if (json) {
                    //const threadStatus = element.querySelector(threadStatusSelector);
                    //threadStatus.innerText = `${json[0]["thread-id"]}, ${json[0]["email-id"]}, ${json[0]["is-read"]}`;
                //}

                //fetchedThreadIds.set(threadId, json);

            //} catch (error) {
                //console.error("There has been a problem with your fetch operation: ", error);
            //}
        });

        //console.log(threadsToFetch);
    }

    function htmlToElement(html) {
        var template = document.createElement("template");
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function getDrafts() {
        const draftSelector = `div[role="region"]`;
        return [...document.querySelectorAll(draftSelector)];
    }

    function getThreadIdFromDraft(draft) {
        const threadIdSelector = `input[name="rt"]`;
        return draft.querySelector(threadIdSelector).value;
    }

    function getMessageIdFromDraft(draft) {
        const messageIdSelector = `input[name="draft"]`;
        return draft.querySelector(messageIdSelector).value;
    }

    // TODO: Create tracker in the database
    function createTracker(senderEmail, messageId, threadId) {
        const trackerCreationURL = `${apiGatewayURL}/tracker/create?sender-email=${senderEmail}&message-id=${messageId}&thread-id=${threadId}`;

    }

    function getSenderEmail() {
        const emailSelector = "title";
        const title = document.head.querySelector(emailSelector).innerText;
        const words = title.split(" ");
        const email = words[words.length - 3];
        console.log(`Sender email: ${email}`);
        return email;
    }

    // TODO: Prevent image loading by finding images with alt="senderEmail" and setting src to "" if senderEmail is the current user
    function insertInvisibleTracker(draft, senderEmail, messageId, threadId) {
        // Adds the tracker to the end of draft
        const contentSelector = "div.Am.aiL.Al.editable.LW-avf.tS-tW";
        const content = draft.querySelector(contentSelector);
        const srcURL = `${apiGatewayURL}/tracker/update?sender=${senderEmail}&messageId=${messageId.split(":")[1]}&threadId=${threadId.split(":")[1]}`;
        console.log(`Tracker URL: ${srcURL}`);
        const tracker = htmlToElement(`<img src="${srcURL}" alt="${senderEmail}" style="display: none;">`);
        content.append(tracker);
    }

    function addTrackerToSendButton() {
        const drafts = getDrafts();
        if (!drafts || !drafts.length) {
            return;
        }

        // Add tracker to each draft
        drafts.forEach(draft => {
            const sendButtonSelector = "td.gU.Up div.dC";

            const threadId = getThreadIdFromDraft(draft);
            const messageId = getMessageIdFromDraft(draft);
            const threadAttr = "data-thread-id";
            const messageAttr = "data-message-id";
            const sendButton = draft.querySelector(sendButtonSelector).firstElementChild;

            // Skips if attributes exist
            if (sendButton.getAttribute(threadAttr) === threadId &&
                sendButton.getAttribute(messageAttr) === messageId
            ) {
                return;
            }

            sendButton.setAttribute(threadAttr, threadId);
            sendButton.setAttribute(messageAttr, messageId);
            document.addEventListener("click", (event) => {
                if (event.target === sendButton) {
                    console.log(`Send button clicked for ${messageId} (${threadId})`);
                    const senderEmail = getSenderEmail();
                    insertInvisibleTracker(draft, senderEmail, messageId, threadId);
                    createTracker(senderEmail, messageId, threadId);
                }
            }, true); // Use capture phase to ensure event is caught before Gmail's listeners
            console.log(`Added tracker for ${messageId} (${threadId})`);
        });
    }

    browser.runtime.onMessage.addListener((message) => {
        const threadIds = getThreadIds();
        return Promise.resolve(threadIds);
    });

    const interval = 1000;
    setInterval(addTrackerToSendButton, interval);
    setInterval(fetchMessageStatuses, interval);

    async function testUrl() {
        try {
            const urlGetEmailDetails = "https://d7ccjmymx2.execute-api.us-west-1.amazonaws.com/default/threads";
            const res = await fetch(urlGetEmailDetails);
            if (!res.ok) {
                throw new Error("Network response was not OK");
            }
            const json = await res.json();
            console.log(json);
        } catch (error) {
            console.error("There has been a problem with your fetch operation: ", error);
        }
    }

    testUrl();
})();
