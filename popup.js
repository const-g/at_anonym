let USER_PRESTA = ""
let USER_DOMAIN = ""
let USER_APIKEY = ""

function saveAliases() {
    console.log("Domain: " + USER_DOMAIN);
}


const restoreOptions = () => {
    chrome.storage.sync.get(
        { presta: 'not set', domain: 'not set', apikey: 'not set' },
        (items) => {
            USER_PRESTA = items.presta;
            USER_DOMAIN = items.domain;
            USER_APIKEY = items.apikey;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let tab = tabs[0];
                const url = new URL(tab.url);
                hostname = url.hostname
                                .replace(/(\.[^.]*)?$/mg, '')
                                .replace(/^(.*\.)?/mg, '');

                newAlias = hostname
                + Math.floor(Math.random() * 9)
                + Math.floor(Math.random() * 9)
                + Math.floor(Math.random() * 9)
                + Math.floor(Math.random() * 9)
                + Math.floor(Math.random() * 9);
                let email = newAlias + "@" + USER_DOMAIN;

                document.getElementById('address').textContent = email;
            });
        }
    );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("saveButton").addEventListener("click", saveAliases);
