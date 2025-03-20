//You can edit ALL of the code here
let ulElement = document.createElement("ul");
let bodyElement = document.getElementById("root");
bodyElement.appendChild(ulElement);

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  for (let episode of allEpisodes) {
    let liElement = document.createElement("li");
    liElement.innerHTML = `<h3>${episode.name}</h3> <p>Season: ${episode.season}, Episode: ${episode.number}</p>
    <img src = ${episode.image.medium}> <p>${episode.summary}</p>`;
    ulElement.appendChild(liElement);
  }
}

/*function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}*/

window.onload = setup;
