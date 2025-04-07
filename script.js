//You can edit ALL of the code here

//Dom elements
const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
let searchInput = document.getElementById("search");
const dropDown = document.getElementById("select");
const showsDropdown = document.getElementById("otherShowsSelect");
ulElement.style.listStyle = "none";

//Global Variables
let allEpisodes = [];
let allShows = [];
let shows = [];

const fetchShows = async () => {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) {
      throw new Error("Failed to fetch shows");
    }
    allShows = await response.json();
    return allShows;
  } catch (err) {
    renderError(err);
    return [];
  }
};

const arrOfShows = async () => {
  try {
    shows = await fetchShows();
    return shows;
  } catch (error) {
    renderError(error);
  }
};

const getShowsArray = async () => {
  return await arrOfShows();
};

(async () => {
  const showsArray = await getShowsArray();
  allShows = showsArray;

  RenderShowsDropDown(showsArray);
  renderAllShows(showsArray);
})();

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  rootElem.innerHTML = "";

  if (allEpisodes.length) {
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
    );
    render(filteredEpisodes);
    makePageForEpisodes(filteredEpisodes);
  } else {
    const filteredShows = shows.filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm) ||
        (show.summary && show.summary.toLowerCase().includes(searchTerm)) ||
        show.genres.join(", ").toLowerCase().includes(searchTerm)
    );
    renderAllShows(filteredShows);
  }
});

//Function to write error
function renderError(errorMessage) {
  rootElem.textContent = errorMessage;
}

//Fetching episodes
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
  if (!allEpisodes.length) {
    renderAllShows(allShows);
    return;
  }
  makePageForEpisodes(allEpisodes);

  /*searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filterShows = shows.filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm) ||
        (show.summary && show.summary.toLowerCase().includes(searchTerm))
    );
    rootElem.innerHTML = "";
    renderAllShows(filterShows);

    render(filterShows);
    makePageForEpisodes(filterShows);
  });*/
  //episode dropdown event listener
  dropDown.addEventListener("change", function () {
    const selectedEpisodeName = dropDown.value;
    if (selectedEpisodeName === "All Episodes") {
      render(allEpisodes);
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find(
        (episode) =>
          `${episode.name} - S${episode.season
            .toString()
            .padStart(2, "0")}E${episode.number
            .toString()
            .padStart(2, "0")}` === selectedEpisodeName
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
//rendering episodes
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

function renderAllShows(show) {
  rootElem.innerHTML = "";

  // Show count paragraph
  const showCount = document.createElement("p");
  showCount.textContent = `Got ${show.length} show(s)`;
  showCount.style.padding = "10px";
  showCount.style.fontWeight = "bold";
  rootElem.appendChild(showCount);

  let showsList = document.createElement("div");
  showsList.classList.add("showListContainer");

  show.forEach((show) => {
    const showCard = document.createElement("div");
    showCard.classList.add("showCard");

    const imageUrl =
      show.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";

    showCard.innerHTML = `
      <img src="${imageUrl}" alt="${
      show.name
    }" style="width: 210px; height: auto; border-radius: 5px;" />
      <div>
        <h3>${show.name}</h3>
        <p>${show.summary}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Rating:</strong> ${show.rating.average}</p>
        <p><strong>Runtime:</strong> ${show.runtime} mins</p>
        <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
      </div>
    `;

    showsList.appendChild(showCard);
  });

  rootElem.appendChild(showsList);
}

//rendering dropdown for episodes
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

//making a page for each episode
function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.style.padding = "10px";
  rootElem.appendChild(ulElement);
}

//rendering Shows in dropdown
function RenderShowsDropDown(shows) {
  shows.sort((a, b) => a.name.localeCompare(b.name));

  showsDropdown.innerHTML = "";
  let defaultOption = document.createElement("option");
  defaultOption.value = "Available Shows";
  defaultOption.textContent = "Available Shows";
  showsDropdown.appendChild(defaultOption);
  shows.forEach((show) => {
    let dropDownOption = document.createElement("option");
    let showName = `${show.name}`;
    let showId = `${show.id}`;

    dropDownOption.value = `${showId}`;
    dropDownOption.textContent = `${showName}`;
    showsDropdown.appendChild(dropDownOption);
  });
}

//eventlistener for shows
showsDropdown.addEventListener("change", async () => {
  let selectedShowId = showsDropdown.value;
  //fetching episode for each show
  if (selectedShowId === "Available Shows") {
    allEpisodes = [];
    rootElem.textContent = "";
    renderAllShows(allShows);
    //countShows(allShows);
    dropDown.style.display = "none";
    return;
  }
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${selectedShowId}/episodes`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }
    const episodes = await response.json();
    rootElem.textContent = "";
    allEpisodes = episodes;

    setup();
    dropDown.style.display = "inline-block";
  } catch (error) {
    renderError(error);
  }
});
window.onload = setup;
