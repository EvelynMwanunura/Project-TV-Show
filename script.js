//You can edit ALL of the code here
import { getAllEpisodes } from "./episodes.js";

const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
ulElement.style.listStyle = "none";

function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);

  allEpisodes.map((episode) => {
    let seasonNumber = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.number.toString().padStart(2, "0");
    let liElement = document.createElement("li");
    liElement.innerHTML = `<h3>${episode.name} - E${seasonNumber}S${episodeNumber}</h3> 
    <img src = ${episode.image.medium} alt ="episode Image"> <p>${episode.summary}</p>`;
    rootElem.appendChild(ulElement);
    ulElement.appendChild(liElement);
  });
}

function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
