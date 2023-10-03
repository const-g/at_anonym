const saveOptions = () => {
  const presta = document.getElementById("presta").value;
  const domain = document.getElementById("domain").value;
  const apikey = document.getElementById("apikey").value;

  chrome.storage.sync.set(
    { presta: presta, domain: domain, apikey: apikey },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    }
  );
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    { presta: 'not set', domain: 'not set', apikey: 'not set' },
    (items) => {
      document.getElementById("presta").value = items.presta;
      document.getElementById("domain").value = items.domain;
      document.getElementById("apikey").value = items.apikey;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
