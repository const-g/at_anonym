function saveAliases() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs)
    });
}

document.getElementById("saveButton").addEventListener("click", saveAliases);
