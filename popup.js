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
                        const aliasesList = document.createElement('ol');
                        aliasesList.class = 'switches';
                        aliases.forEach(alias => {
                            const aliasItem = document.createElement('li');
                            const switchItem = document.createElement('input');
                            const label = document.createElement('label');
                            const span1 = document.createElement('span');
                            const span2 = document.createElement('span');
                            
                            switchItem.type = 'checkbox';
                            aliasItem.classList.add("form-switch");
                            switchItem.checked = alias.startsWith('DISABLE-') ? false : true;
                            span1.textContent = alias.startsWith('DISABLE-') ? alias.slice(8) : alias;
                            
                            label.appendChild(span1);
                            label.appendChild(span2);
                            aliasItem.appendChild(switchItem);
                            aliasItem.appendChild(label);
                            aliasesList.appendChild(aliasItem);

                            // Create delete button
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = '❌';
                            aliasItem.appendChild(deleteButton);

                            // Add event listener to delete button
                            deleteButton.addEventListener('click', function() {
                                // Call deleteAlias function
                                deleteAlias(alias);
                                // Remove aliasItem from the list
                                aliasesList.removeChild(aliasItem);
                            });
                        });
                        document.getElementById('existingAliases').appendChild(aliasesList);
                    });
                }

                document.querySelector('#saveButton').addEventListener('click', function() {
                    if (USER_PROVIDER === 'infomaniak') {
                            if (main_create(USER_APIKEY, USER_MAIL, newAlias)) {
                                async function getAlias() {
                                    const [MAILBOXS_ID, ALIASES] = await listAliases(USER_APIKEY, USER_USER, USER_DOMAIN);
                                    return ALIASES;
                                }
                                const aliases = getAlias().then(aliases => {
                                    const aliasesList = document.createElement('ol');
                                    aliasesList.class = 'switches';
                                    aliases.forEach(alias => {
                                        const aliasItem = document.createElement('li');
                                        const switchItem = document.createElement('input');
                                        const label = document.createElement('label');
                                        const span1 = document.createElement('span');
                                        const span2 = document.createElement('span');
                                        
                                        switchItem.type = 'checkbox';
                                        switchItem.checked = alias.startsWith('DISABLE-') ? false : true;
                                        span1.textContent = alias.startsWith('DISABLE-') ? alias.slice(8) : alias;
                                        
                                        label.appendChild(span1);
                                        label.appendChild(span2);
                                        aliasItem.appendChild(switchItem);
                                        aliasItem.appendChild(label);
                                        aliasesList.appendChild(aliasItem);
            
                                        // Create delete button
                                        const deleteButton = document.createElement('button');
                                        deleteButton.textContent = '❌';
                                        aliasItem.appendChild(deleteButton);
            
                                        // Add event listener to delete button
                                        deleteButton.addEventListener('click', function() {
                                            // Call deleteAlias function
                                            deleteAlias(alias);
                                            // Remove aliasItem from the list
                                            aliasesList.removeChild(aliasItem);
                                        });
                                    });
                                    document.getElementById('existingAliases').textContent = '';
                                    document.getElementById('existingAliases').appendChild(aliasesList);
                                });
                            }
                    }
                  });
                
            });
        }
    );
}



document.addEventListener('DOMContentLoaded', restoreOptions);
//document.getElementById("saveButton").addEventListener("click", saveAliases);
