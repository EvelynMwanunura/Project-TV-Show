// DOM Elements
const rootElem = document.getElementById("root");
let ulElement = document.createElement("ul");
let searchInput = document.getElementById("search");
const dropDown = document.getElementById("select");
const showsDropdown = document.getElementById("otherShowsSelect");
ulElement.style.listStyle = "none";

// Global Variables
let allEpisodes = [];
let allShows = [];
let shows = [];

// Function to fetch data from the API
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

// Self-invoking function to fetch and render shows
(async () => {
  const showsArray = await fetchShows();
  shows = showsArray; // Add this line
  RenderShowsDropDown(showsArray);
  renderAllShows(showsArray);
  renderRatingDropdown(showsArray);
  renderGenreDropdown(showsArray);
})();

// this is just a function to show error
function renderError(errorMessage) {
  rootElem.textContent = errorMessage;
}

// this is an async function to fetch episodes from the API
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
// function to render all shows
function renderAllShows(show) {
  rootElem.innerHTML = "";

  // Code to show how many shows are showing
  const showCount = document.createElement("p");
  showCount.textContent = `Got ${show.length} show(s)`;
  showCount.style.padding = "10px";
  showCount.style.color = "white";
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
      <div class="imageWrapper">
        <img src="${imageUrl}" alt="${show.name}" class="showImage" />
        <div class="showDetails">
          <h3>${show.name}</h3>
          <p><strong>Status:</strong> ${show.status}</p>
          <p><strong>Rating:</strong> ${show.rating.average ?? "N/A"}</p>
          <p><strong>Runtime:</strong> ${show.runtime ?? "N/A"} mins</p>
          <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
          <button class="showMoreBtn">Show More</button>
        </div>
      </div>
    `;
    const showMoreBtn = showCard.querySelector(".showMoreBtn");
    showMoreBtn.addEventListener("click", () => {
      localStorage.setItem("selectedShow", JSON.stringify(show));
      window.location.href = "details.html";
    });

    showsList.appendChild(showCard);
  });

  rootElem.appendChild(showsList);
}

// Rendering Shows in dropdown
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

// Function to render episodes
function render(episodes) {
  ulElement.innerHTML = "";
  episodes.forEach((episode) => {
    let seasonNumber = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.number.toString().padStart(2, "0");
    let liElement = document.createElement("li");
    liElement.innerHTML = `
      <h3>${episode.name} - S${seasonNumber}E${episodeNumber}</h3> 
      <img src="${episode.image.medium}" alt="episode Image"> 
      <p>${episode.summary}</p>`;
    ulElement.appendChild(liElement);
  });
}

// Rendering episodes dropdown
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
// Search Input Event Listener, if the page is showing episodes then it will search episodes else it will search shows matching the search term
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  rootElem.innerHTML = "";

  const filteredShows = allShows.filter(
    (show) =>
      show.name.toLowerCase().includes(searchTerm) ||
      (show.summary && show.summary.toLowerCase().includes(searchTerm)) ||
      show.genres.join(", ").toLowerCase().includes(searchTerm)
  );

  // Update the shows dropdown, shows list, rating and genre dropdowns
  RenderShowsDropDown(filteredShows);
  renderAllShows(filteredShows);
  renderRatingDropdown(filteredShows);
  renderGenreDropdown(filteredShows);
});

// Setup function to render episodes and dropdown
function setup() {
  //conditional statement, that if there is no episodes it should default to all shows
  if (!allEpisodes.length) {
    renderAllShows(allShows);
    return;
  }
  makePageForEpisodes(allEpisodes);

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

// Function  to count episodes showing
function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.style.padding = "10px";
  rootElem.style.color = "white";
  rootElem.appendChild(ulElement);
}

// Event Listener for Shows Dropdown
showsDropdown.addEventListener("change", async () => {
  let selectedShowId = showsDropdown.value;
  if (selectedShowId === "Available Shows") {
    allEpisodes = [];
    rootElem.textContent = "";
    renderAllShows(allShows);
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

function renderRatingDropdown(shows) {
  const ratingDropdown = document.getElementById("rating");
  ratingDropdown.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Rating";
  ratingDropdown.appendChild(defaultOption);

  // Get unique ratings and sort them
  const uniqueRatings = [
    ...new Set(
      shows
        .map((show) => show.rating.average)
        .filter((rating) => rating !== null)
        .sort((a, b) => b - a)
    ),
  ];

  uniqueRatings.forEach((rating) => {
    const option = document.createElement("option");
    option.value = rating;
    option.textContent = rating;
    ratingDropdown.appendChild(option);
  });

  // Event listener for dropdown filter
  ratingDropdown.addEventListener("change", () => {
    const selectedRating = parseFloat(ratingDropdown.value);

    if (!selectedRating) {
      renderAllShows(shows); // Reset to show all
    } else {
      const filtered = shows.filter(
        (show) => show.rating.average === selectedRating
      );
      renderAllShows(filtered);
    }
  });
}

//Filter by Genre

function renderGenreDropdown(shows) {
  const genreDropdown = document.getElementById("genre");
  genreDropdown.innerHTML = "";

  // Create default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Genre";
  genreDropdown.appendChild(defaultOption);

  // Collect all genres into a single array
  const allGenres = shows.flatMap((show) => show.genres || []);
  const uniqueGenres = [...new Set(allGenres)].sort();

  // Populate dropdown with unique genres
  uniqueGenres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreDropdown.appendChild(option);
  });

  // Event listener to filter shows by selected genre
  genreDropdown.addEventListener("change", () => {
    const selectedGenre = genreDropdown.value;

    if (!selectedGenre) {
      renderAllShows(shows); // Show all if no genre selected
    } else {
      const filteredShows = shows.filter((show) =>
        show.genres.includes(selectedGenre)
      );
      renderAllShows(filteredShows);
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detailsContainer");
  const showData = localStorage.getItem("selectedShow");

  if (!showData) {
    window.location.href = "index.html"; // auto-redirect if no data
    return;
  }

  const show = JSON.parse(showData);
  const imageUrl =
    show.image?.original ?? "https://via.placeholder.com/300x450?text=No+Image";

  container.innerHTML = `
    <div class="showDetailsPage" style="padding: 20px; color: white; max-width: 800px; margin: auto;">
      <h2>${show.name}</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        <img src="${imageUrl}" alt="${
    show.name
  }" style="max-width: 300px; border-radius: 10px;" />
        <div style="flex: 1;">
          <p><strong>Language:</strong> ${show.language}</p>
          <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
          <p><strong>Status:</strong> ${show.status}</p>
          <p><strong>Runtime:</strong> ${show.runtime} mins</p>
          <p><strong>Rating:</strong> ${show.rating.average ?? "N/A"}</p>
          <p><strong>Premiered:</strong> ${show.premiered}</p>
          <p><strong>Official Site:</strong> <a href="${
            show.officialSite
          }" target="_blank" style="color: lightblue;">Visit Site</a></p>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <h3>Summary</h3>
        <div>${show.summary}</div>
      </div>
      <div style="margin-top: 20px;">
        <button onclick="window.history.back()" style="padding: 10px 15px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">← Back to All Shows</button>
      </div>
    </div>
  `;
});

// Window onload setup
window.onload = setup;
