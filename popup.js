let USER_PROVIDER = ""
let USER_DOMAIN = ""
let USER_USER = ""
let USER_MAIL = ""
let USER_APIKEY = ""

// const { provider, mail, apikey } = chrome.storage.sync.get(
//     { provider: 'not set', mail: 'not set', apikey: 'not set' },
//     (items) => {
//         const { provider, mail, apikey } = items;
//         console.log(provider)
//         // Your code here to use the retrieved values
//     }
// );


document.querySelector('#go-to-options').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

function saveAliases() {
    console.log("Domain: " + USER_DOMAIN);
}

const restoreOptions = () => {
    chrome.storage.sync.get(
        { provider: 'not set', mail: 'not set', apikey: 'not set' },
        (items) => {
            USER_PROVIDER = items.provider;
            USER_USER = items.mail.split('@')[0];
            USER_DOMAIN = items.mail.split('@')[1];
            USER_APIKEY = items.apikey;
            console.log(USER_APIKEY);
            USER_MAIL = items.mail
            document.getElementById('provider').textContent = USER_PROVIDER;
            document.getElementById('mail').textContent = items.mail;
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
                
                
                if (USER_PROVIDER === 'infomaniak') {
                    async function getAlias() {
                        const [MAILBOXS_ID, ALIASES] = await listAliases(USER_APIKEY, USER_USER, USER_DOMAIN);
                        return ALIASES;
                    }
                    const aliases = getAlias().then(aliases => {
                        const aliasesList = document.createElement('ul');
                        aliases.forEach(alias => {
                            const aliasItem = document.createElement('li');
                            aliasItem.textContent = alias;
                            const switchItem = document.createElement('input');
                            switchItem.type = 'checkbox';
                            switchItem.checked = alias.startsWith('DISABLE-') ? false : true;
                            aliasItem.appendChild(switchItem);
                            aliasesList.appendChild(aliasItem);
                        });
                        document.getElementById('existingAliases').appendChild(aliasesList);
                    });
                }

                
            });
        }
    );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("saveButton").addEventListener("click", saveAliases);
