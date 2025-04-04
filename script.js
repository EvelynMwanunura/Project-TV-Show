//You can edit ALL of the code here

const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
let searchInput = document.getElementById("search");
const dropDown = document.getElementById("select");
const otherShows = document.getElementById("otherShowSelect")
ulElement.style.listStyle = "none";
let allEpisodes = [];
let allShows = []
let shows = []

const fetchShows = async () => {
  try{
    const response = await fetch("https://api.tvmaze.com/shows")
    if(!response.ok){
      throw new Error("Failed to fetch shows")
    }
    allShows = await response.json()
    return allShows
  } catch(err){renderError(err)
    return []
  }
}
  
const arrOfShows = async () => {
 try{
shows = await fetchShows()
console.log(shows)
} catch(error){renderError(error)}
}
(async () => {
  const showsArray = await arrOfShows();
  console.log(showsArray)
  return showsArray
})()

 console.log(arrOfShows())  

//Function to write error
function renderError(errorMessage){
  rootElem.textContent = errorMessage;

}
async function fetchEpisodes() {
  try {
    rootElem.textContent = "Loading episodes...";
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error("Failed to fetch episodes.");
    
    }
    allEpisodes = await response.json();
    rootElem.textContent = "";
    setup();
  } catch (error) {
    renderError("Error loading episodes. Please try again later.");
  }
}


function setup() {
  makePageForEpisodes(allEpisodes);

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    render(filteredEpisodes);
    makePageForEpisodes(filteredEpisodes);
  });

  dropDown.addEventListener("change", function () {
    const selectedEpisodeName = dropDown.value;
    if(selectedEpisodeName === "All Episodes"){
      render(allEpisodes)
      makePageForEpisodes(allEpisodes)
    }else
   {const selectedEpisode = allEpisodes.find(
      (episode) =>
        `${episode.name} - S${episode.season
          .toString()
          .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}` ===
        selectedEpisodeName
   
    );

    if (selectedEpisode) {
      render([selectedEpisode]);
      makePageForEpisodes([selectedEpisode]);
    }
  }
  });

  render(allEpisodes);
  renderDropDown(allEpisodes);
}
function render(episodes) {
  ulElement.innerHTML = "";

  episodes.forEach((episode) => {
    let seasonNumber = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.number.toString().padStart(2, "0");
    let liElement = document.createElement("li");
    liElement.innerHTML = `<h3>${episode.name} - S${seasonNumber}E${episodeNumber}</h3> 
    <img src = ${episode.image.medium} alt ="episode Image"> <p>${episode.summary}</p>`;

    ulElement.appendChild(liElement);
  });
}

function renderDropDown(episodes) {
  
  dropDown.innerHTML = "";
  let allEpisodesOption = document.createElement("option");
  allEpisodesOption.value = "All Episodes";
  allEpisodesOption.textContent = "All Episodes";
  allEpisodesOption.selected = true;
  dropDown.appendChild(allEpisodesOption);
  episodes.forEach((episode) => {
    let dropDownOption = document.createElement("option");
    let seasonNumber = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.number.toString().padStart(2, "0");

    dropDownOption.value = `${episode.name} - S${seasonNumber}E${episodeNumber}`;
    dropDownOption.textContent = `${episode.name} - S${seasonNumber}E${episodeNumber}`;
    dropDown.appendChild(dropDownOption);
  });
}

function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.style.padding = "10px";
  rootElem.appendChild(ulElement);
}

window.onload = fetchEpisodes;
