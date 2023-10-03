let USER_PRESTA = ""
let USER_DOMAIN = ""
let USER_APIKEY = ""

// const { provider, mail, apikey } = chrome.storage.sync.get(
//     { provider: 'not set', mail: 'not set', apikey: 'not set' },
//     (items) => {
//         const { provider, mail, apikey } = items;
//         console.log(provider)
//         // Your code here to use the retrieved values
//     }
// );

const { provider, mail, apikey } = chrome.storage.sync.get(
    { provider: 'not set', mail: 'not set', apikey: 'not set' },
    (items) => {
        const { provider, mail, apikey } = items;
        document.getElementById('provider').textContent = provider;
        document.getElementById('mail').textContent = mail;
    }
);

const [USER, DOMAIN] = mail.split('@');

document.querySelector('#go-to-options').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

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
                let email = newAlias + "@" + DOMAIN;

                document.getElementById('address').textContent = email;
            });
        }
    );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("saveButton").addEventListener("click", saveAliases);
