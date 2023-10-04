const saveOptions = () => {
  const provider = document.getElementById("provider").value;
  const mail = document.getElementById("mail").value;
  const apikey = document.getElementById("apikey").value;

  chrome.storage.sync.set(
    { provider: provider, mail: mail, apikey: apikey },
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
    { provider: 'not set', mail: 'not set', apikey: 'not set' },
    (items) => {
      document.getElementById("provider").value = items.provider;
      document.getElementById("mail").value = items.mail;
      document.getElementById("apikey").value = items.apikey;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
