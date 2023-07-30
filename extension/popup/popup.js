function getThreadId(tabs) {
    return browser.tabs.sendMessage(tabs[0].id, {});
}

function showThreadId(threadIds) {
    let text = "";
    threadIds.forEach(id => text += id);
    let p = document.getElementById("thread-id");
    p.innerText = text;
}

function listenForClicks() {
    document.addEventListener("click", (e) => {
        function reportError(error) {
            console.error(`Could not get thread ID: ${error}`);
        }

        //console.log(e);
        browser.tabs
            .query({active: true, currentWindow: true})
            .then(getThreadId)
            .then(showThreadId)
            .catch(reportError);
    })
}

function reportExecuteScriptError(error) {
    console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * Injects the content script into the active tab
 * and adds a click handler
 */

listenForClicks();

//browser.tabs
    //.executeScript({ file: "/content_script/email.js" })
    //.then(listenForClicks)
    //.catch(reportExecuteScriptError);
