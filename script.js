//You can edit ALL of the code here
import { getAllEpisodes } from "./episodes.js";

const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
ulElement.style.listStyle = "none";

function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);

  allEpisodes.map((episode) => {
    let liElement = document.createElement("li");
    liElement.innerHTML = `<h3>${episode.name} - E${episode.season}S${episode.number}</h3> 
    <img src = ${episode.image.medium}> <p>${episode.summary}</p>`;
    rootElem.appendChild(ulElement);
    ulElement.appendChild(liElement);
  });
}

function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
