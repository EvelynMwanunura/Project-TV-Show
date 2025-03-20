//You can edit ALL of the code here
import { getAllEpisodes } from "./episodes.js";
const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
ulElement.style.listStyle = "none";

function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);
  for (let episode of allEpisodes) {
    let liElement = document.createElement("li");
    liElement.innerHTML = `<h3>${episode.name}</h3> <p>Season: ${episode.season}, Episode: ${episode.number}</p>
    <img src = ${episode.image.medium}> <p>${episode.summary}</p>`;
    rootElem.appendChild(ulElement);
    ulElement.appendChild(liElement);
  }
}

function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
