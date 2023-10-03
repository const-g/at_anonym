function saveAliases() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let DOMAIN = "mydomain.com"

        let tab = tabs[0];
        const url = new URL(tab.url);
        hostname = url.hostname
                        .replace(/(\.[^.]*)?$/mg, '')
                        .replace(/^(.*\.)?/mg, '');

        newAlias = 'c-' + hostname
        + Math.floor(Math.random() * 9)
        + Math.floor(Math.random() * 9)
        + Math.floor(Math.random() * 9)
        + Math.floor(Math.random() * 9)
        + Math.floor(Math.random() * 9);
        let email = newAlias + "@" + DOMAIN;

        document.getElementById('address').textContent = email;
    });
}

document.getElementById("saveButton").addEventListener("click", saveAliases);
