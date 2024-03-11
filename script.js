const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  volume = wrapper.querySelector(".word i"),
  infoText = wrapper.querySelector(".info-text"),
  synonyms = wrapper.querySelector(".synonyms .list"),
  removeIcon = wrapper.querySelector(".search span");
let audio;

// data function
function data(result, word) {
  if (result.title) {
    // if API returns the message of can't find word
    infoText.innerHTML = `Can't find the meading of <span>${word}</span>. Please, try to search another word`;
  } else {
    console.log(result);
    wrapper.classList.add("active");
    let definitions = result[0].meanings[0].definitions[0],
      phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phontetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    audio = new Audio(result[0].phonetics[0].audio);

    if (definitions.synonyms[0] == undefined) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
        tag =
          i == 4
            ? (tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`)
            : tag;
        synonyms.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}

//   fetch api function
async function fetchApi(word) {
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>  `;


  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const result = await response.json();
    data(result, word);
    console.log(word);
  } catch (err) {
    alert("Not Word");
  }
}

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
  }
});

volume.addEventListener("click", ()=>{
  volume.style.color = "#4D59FB";
  audio.play();
  setTimeout(() =>{
      volume.style.color = "#999";
  }, 800);
});

function search(word){
  fetchApi(word);
  searchInput.value = word;
}

removeIcon.addEventListener("click", ()=>{
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
