const API_URL = "http://localhost:3000/api/shorten";

function copy(target) {
  // Element to select
  let copyText = target.closest(".shorten-url").children[0].innerText;
  navigator.clipboard.writeText(copyText);
}

document.addEventListener("click", (e) => {
  if (e.target.matches("span") && e.target.classList.contains("copyboard")) {
    copy(e.target);
  }
});

const content = document.querySelector(".content");

function putUrlOnThePage(url) {
  let shortenUrl = document.createElement("div");
  shortenUrl.classList.add("shorten-url");
  let urlLink = document.createElement("a");
  urlLink.classList.add("shorten-url-link");
  urlLink.href = url;
  urlLink.target = "_blank";
  urlLink.textContent = url;
  let copyboard = document.createElement("span");
  copyboard.classList.add("copyboard");

  shortenUrl.appendChild(urlLink);
  shortenUrl.appendChild(copyboard);

  content.appendChild(shortenUrl);
  content.classList.add("show");
}

const shortenForm = document.querySelector(".shorten-form");

shortenForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formData = new FormData(shortenForm);
  let url = formData.get("url").toString();
  let payload = { url };

  if (url.trim() == "" || !url.match(/https?:\/\//)) {
    return;
  }

  // Make request to API
  try {
    let request = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let response = await request.json();

    if (response.short) {
      putUrlOnThePage(response.short);
    } else {
      content.innerHTML = `<h2>${response.message}</h2>`;
    }
  } catch (err) {
    console.error(err);
  }
});
