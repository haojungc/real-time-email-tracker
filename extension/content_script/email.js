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

    document.addEventListener("click", function lambdaTest() {
        const client = new LambdaClient(config);
        const input = { // InvocationRequest
            FunctionName: "get-email-status-lambda", // required
            InvocationType: "Event" || "RequestResponse" || "DryRun",
            LogType: "None" || "Tail",
            ClientContext: "STRING_VALUE",
            Payload: "BLOB_VALUE",
            Qualifier: "STRING_VALUE",
        };
        const command = new InvokeCommand(input);
        //const response = await client.send(command);
        // { // InvocationResponse
        //   StatusCode: Number("int"),
        //   FunctionError: "STRING_VALUE",
        //   LogResult: "STRING_VALUE",
        //   Payload: "BLOB_VALUE",
        //   ExecutedVersion: "STRING_VALUE",
        // };

        //console.log(response);
    });

    browser.runtime.onMessage.addListener((message) => {
        const threadIds = getThreadIds();
        return Promise.resolve(threadIds);
    });

    const interval = 1000;
    setInterval(addTrackerToSendButton, interval);

    async function testUrl() {
        try {
            const urlGetEmailDetails = "https://hfoaukd3ydzh5kvxxssvrawx2m0huabh.lambda-url.us-east-1.on.aws/";
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
