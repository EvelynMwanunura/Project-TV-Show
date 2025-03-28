//You can edit ALL of the code here

const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
let searchInput = document.getElementById("search")
ulElement.style.listStyle = "none";

function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);

  searchInput.addEventListener('keyup', function(){
    allEpisodes.searchTerm = searchInput.value

    const filteredEpisodes = allEpisodes.filter(function(episode){
      return episode.name.includes(episode.searchTerm) 
    }
    )
  })
}

  function render(){
  allEpisodes.map((episode) => {
    let seasonNumber = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.number.toString().padStart(2, "0");
    let liElement = document.createElement("li");
    liElement.innerHTML = `<h3>${episode.name} - S${seasonNumber}E${episodeNumber}</h3> 
    <img src = ${episode.image.medium} alt ="episode Image"> <p>${episode.summary}</p>`;
    
    ulElement.appendChild(liElement);
  });

  rootElem.appendChild(ulElement);
}

render()


function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.style.padding = "10px";
}

window.onload = setup;
