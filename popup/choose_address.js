async function saveAliases(newAlias) {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Apikey ' + APIKEY);


    let DOMAIN = '';
    let ID_MAILBOX = '';


    const validationRequest = new Request("https://api.gandi.net/v5/email/mailboxes/" + DOMAIN + "/" + ID_MAILBOX, {
        method: "GET",
        headers: myHeaders,
        cache: 'no-store'
    });


    const response = await fetch(validationRequest);
    response.json().then((json) => {
        if (response.status === 200) {
            document.getElementById('status').innerHTML = "🔄 ..."
            let aliases = json['aliases']
            aliases.push(newAlias);
            body = JSON.stringify({"aliases" : aliases});
            // console.log(body);

            let headersList = {
                "Accept": "*/*",
                "Authorization": "Apikey " + APIKEY,
                "Content-Type": "application/json"
            }

            fetch("https://api.gandi.net/v5/email/mailboxes/" + DOMAIN + "/" + ID_MAILBOX, {
                method: "PATCH",
                body: body,
                headers: headersList
            }).then(function(response) {
                response.json()
                    .then((json) => {
                        if (response.status === 202) {
                            document.getElementById('status').innerHTML = "<span> ✅</span>";
                            navigator.clipboard.writeText(newAlias+"@" + DOMAIN).then(function() {

                                document.getElementById('status').innerHTML = document.getElementById('status').innerHTML + " <span>Adresse copiée en mémoire !</span>";
                            });
                            console.log('OK !', json);
                        } else {
                            console.error(`Error on Patch:`, response);
                            throw response.status;
                        }
                    });
            });
        } else {
            console.error(response);
            throw response.status;
        }
    });
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {

        let newAlias = '';

        document.getElementById('saveButton').addEventListener('click', () => {
            if(document.getElementById('address').textContent) {
                saveAliases(newAlias)
                .catch((error) => {
                    console.error(`Error: ${error}`);
                });
            }
        });

        browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
            let tab = tabs[0]; // Safe to assume there will only be one result
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


            let headersList = {
                "Accept": "*/*",
                "Authorization": "Apikey " + APIKEY,
                "Content-Type": "application/json"
            }

            fetch("https://api.gandi.net/v5/email/mailboxes/" + DOMAIN + "/" + ID_MAILBOX, {
                method: "GET",
                headers: headersList
            }).then(function(response) {
                response.json()
                    .then((json) => {
                        if (response.status === 200) {
                            let newUl = document.createElement("ul");
                            let index = 0;

                            json['aliases'].map(n => {
                                let checked = true;
                                let alias = n;

                                if(n.startsWith('INACTIVE-')) {
                                    checked = false;
                                    alias = alias.replace('INACTIVE-', '');
                                }

                                let newLi = document.createElement("li");

                                let aliasName = document.createElement("span");
                                aliasName.innerHTML = `${alias}`;
                                newLi.appendChild(aliasName);

                                let aliasSwitchLabel = document.createElement("label");
                                aliasSwitchLabel.classList.add("form-switch");
                                let aliasSwitchInput = document.createElement("input");
                                aliasSwitchInput.type = 'checkbox';
                                aliasSwitchInput.checked = checked;
                                aliasSwitchInput.dataset.index = index;
                                aliasSwitchInput.value = n;
                                aliasSwitchInput.addEventListener('change', function() {
                                    console.log(this.dataset.index, this.checked, this.value, json['aliases'][this.dataset.index]);

                                    if (this.checked) {
                                        json['aliases'][this.dataset.index] = json['aliases'][this.dataset.index].replace('INACTIVE-', '');
                                    } else {
                                        json['aliases'][this.dataset.index] = 'INACTIVE-' + json['aliases'][this.dataset.index].replace('INACTIVE-', '');
                                    }

                                    let headersList = {
                                        "Accept": "*/*",
                                        "Authorization": "Apikey" + APIKEY,
                                        "Content-Type": "application/json"
                                    }

                                    fetch("https://api.gandi.net/v5/email/mailboxes/" + DOMAIN + "/" + ID_MAILBOX, {
                                        method: "PATCH",
                                        body: JSON.stringify({"aliases" : json['aliases']}),
                                        headers: headersList
                                    }).then(function(response) {
                                        response.json()
                                            .then(() => {
                                                if (response.status === 202) {
                                                    document.getElementById('status').innerHTML = "<span>Mise à jour : OK</span>";
                                                } else {
                                                    console.error(`Error on Patch:`, response);
                                                    throw response.status;
                                                }
                                            });
                                    });
                                });
                                let aliasSwitchInputI = document.createElement("i");

                                aliasSwitchLabel.appendChild(aliasSwitchInput);
                                aliasSwitchLabel.appendChild(aliasSwitchInputI);
                                newLi.appendChild(aliasSwitchLabel);

                                newUl.appendChild(newLi);
                                index = index + 1;

                                document.getElementById('existingAliases').appendChild(newUl);
                                return true;
                            });
                        } else {
                            console.error(`Error on get:`, response);
                            throw response.status;
                        }
                    });
            });

        }, console.error);
    }
}
