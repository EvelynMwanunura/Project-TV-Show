//You can edit ALL of the code here

const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
let searchInput = document.getElementById("search")
const dropDown= document.getElementById("select")
ulElement.style.listStyle = "none";

function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);
 
  searchInput.addEventListener('input', function(){
    const searchTerm = searchInput.value.toLowerCase()
    const filteredEpisodes = allEpisodes.filter(function(episode){
      return episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm)
    })
    render(filteredEpisodes)
    makePageForEpisodes(filteredEpisodes);
  })

  dropDown.addEventListener("change", function(){
    const selectedEpisodeName = dropDown.value
    const selectedEpisode = allEpisodes.find(episode => `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}` === selectedEpisodeName)
 
    if (selectedEpisode) {
      render([selectedEpisode]);
      makePageForEpisodes([selectedEpisode]);
    }
  })
  
  render(allEpisodes)
  renderDropDown(allEpisodes)
  
}
  function render(episodes){
    ulElement.innerHTML = ''

  episodes.map((episode) => {
    let seasonNumber = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.number.toString().padStart(2, "0");
    let liElement = document.createElement("li");
    liElement.innerHTML = `<h3>${episode.name} - S${seasonNumber}E${episodeNumber}</h3> 
    <img src = ${episode.image.medium} alt ="episode Image"> <p>${episode.summary}</p>`;
    
    ulElement.appendChild(liElement);
  });
}

function renderDropDown(episodes){
  dropDown.innerHTML = ''
  episodes.forEach((episode)=>{
    let dropDownOption = document.createElement("option")
    let seasonNumber = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.number.toString().padStart(2, "0");

    
    dropDownOption.value = `${episode.name} - S${seasonNumber}E${episodeNumber}`;
    dropDownOption.textContent = `${episode.name} - S${seasonNumber}E${episodeNumber}`
   

    dropDown.appendChild(dropDownOption)

  

  })

}


function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.style.padding = "10px";
  rootElem.appendChild(ulElement);
}

window.onload = setup;
