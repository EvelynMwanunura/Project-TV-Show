// DOM Elements
const rootElem = document.getElementById("root");
const searchInput = document.getElementById("search");
const dropDown = document.getElementById("select");
const showsDropdown = document.getElementById("otherShowsSelect");

const ulElement = document.createElement("ul");
ulElement.style.listStyle = "none";

// Global Variables
let allEpisodes = [];
let allShows = [];
let shows = [];

// Fetch Shows
const fetchShows = async () => {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error("Failed to fetch shows");
    allShows = await response.json();
    return allShows;
  } catch (err) {
    renderError(err.message);
    return [];
  }
};

// Render error message
function renderError(errorMessage) {
  rootElem.innerHTML = `<p style="color: red; font-weight: bold;">${errorMessage}</p>`;
}

// Initial Page Load
document.addEventListener("DOMContentLoaded", async () => {
  shows = await fetchShows();
  renderAllShows(shows);
  RenderShowsDropDown(shows);
  renderRatingDropdown(shows);
  renderGenreDropdown(shows);
});

// Render All Shows
function renderAllShows(showList) {
  rootElem.innerHTML = "";

  const showCount = document.createElement("p");
  showCount.textContent = `Got ${showList.length} show(s)`;
  showCount.style.padding = "10px";
  showCount.style.color = "white";
  showCount.style.fontWeight = "bold";
  rootElem.appendChild(showCount);

  const showsList = document.createElement("div");
  showsList.classList.add("showListContainer");

  showList.forEach((show) => {
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

    showCard.querySelector(".showMoreBtn").addEventListener("click", () => {
      localStorage.setItem("selectedShow", JSON.stringify(show));
      window.location.href = "details.html";
    });

    showsList.appendChild(showCard);
  });

  rootElem.appendChild(showsList);
}

// Render Shows Dropdown
function RenderShowsDropDown(shows) {
  showsDropdown.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "Available Shows";
  defaultOption.textContent = "Available Shows";
  showsDropdown.appendChild(defaultOption);

  shows
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showsDropdown.appendChild(option);
    });
}

// Fetch and render episodes
async function fetchEpisodes(showId) {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok) throw new Error("Failed to fetch episodes.");
    allEpisodes = await response.json();
    setup();
    dropDown.style.display = "inline-block";
  } catch (error) {
    renderError("Error loading episodes. Please try again later.");
  }
}

// Setup rendering for episodes
function setup() {
  if (!allEpisodes.length) {
    renderAllShows(allShows);
    return;
  }

  render(allEpisodes);
  renderDropDown(allEpisodes);
  makePageForEpisodes(allEpisodes);

  dropDown.addEventListener("change", () => {
    const selected = dropDown.value;
    if (selected === "All Episodes") {
      render(allEpisodes);
      makePageForEpisodes(allEpisodes);
    } else {
      const episode = allEpisodes.find((ep) => {
        const season = ep.season.toString().padStart(2, "0");
        const number = ep.number.toString().padStart(2, "0");
        return `${ep.name} - S${season}E${number}` === selected;
      });
      if (episode) {
        render([episode]);
        makePageForEpisodes([episode]);
      }
    }
  });
}

// Render episodes list
function render(episodes) {
  ulElement.innerHTML = "";
  episodes.forEach((ep) => {
    const season = ep.season.toString().padStart(2, "0");
    const number = ep.number.toString().padStart(2, "0");
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${ep.name} - S${season}E${number}</h3>
      <img src="${ep.image?.medium || ""}" alt="Episode Image" />
      <p>${ep.summary}</p>`;
    ulElement.appendChild(li);
  });
}

// Render episode dropdown
function renderDropDown(episodes) {
  dropDown.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "All Episodes";
  allOption.textContent = "All Episodes";
  allOption.selected = true;
  dropDown.appendChild(allOption);

  episodes.forEach((ep) => {
    const season = ep.season.toString().padStart(2, "0");
    const number = ep.number.toString().padStart(2, "0");
    const option = document.createElement("option");
    option.value = `${ep.name} - S${season}E${number}`;
    option.textContent = option.value;
    dropDown.appendChild(option);
  });
}

// Update episode count
function makePageForEpisodes(list) {
  rootElem.innerHTML = `<p style="padding: 10px; color: white;">Got ${list.length} episode(s)</p>`;
  rootElem.appendChild(ulElement);
}

// Filter with search
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = allShows.filter(
    (show) =>
      show.name.toLowerCase().includes(term) ||
      (show.summary && show.summary.toLowerCase().includes(term)) ||
      show.genres.join(", ").toLowerCase().includes(term)
  );

  RenderShowsDropDown(filtered);
  renderAllShows(filtered);
  renderRatingDropdown(filtered);
  renderGenreDropdown(filtered);
});

// Handle show dropdown
showsDropdown.addEventListener("change", () => {
  const selectedId = showsDropdown.value;
  if (selectedId === "Available Shows") {
    allEpisodes = [];
    renderAllShows(allShows);
    dropDown.style.display = "none";
  } else {
    fetchEpisodes(selectedId);
  }
});

// Rating filter
function renderRatingDropdown(shows) {
  const ratingDropdown = document.getElementById("rating");
  ratingDropdown.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Rating";
  ratingDropdown.appendChild(defaultOption);

  const uniqueRatings = [
    ...new Set(shows.map((s) => s.rating.average).filter(Boolean)),
  ].sort((a, b) => b - a);

  uniqueRatings.forEach((rating) => {
    const option = document.createElement("option");
    option.value = rating;
    option.textContent = rating;
    ratingDropdown.appendChild(option);
  });

  ratingDropdown.addEventListener("change", () => {
    const selectedRating = parseFloat(ratingDropdown.value);
    if (!selectedRating) {
      renderAllShows(shows);
    } else {
      const filtered = shows.filter((s) => s.rating.average === selectedRating);
      renderAllShows(filtered);
      renderGenreDropdown(filtered);
      renderDropDown(filtered);
    }
  });
}

// Genre filter
function renderGenreDropdown(shows) {
  const genreDropdown = document.getElementById("genre");
  genreDropdown.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Genre";
  genreDropdown.appendChild(defaultOption);

  const allGenres = shows.flatMap((s) => s.genres || []);
  const uniqueGenres = [...new Set(allGenres)].sort();

  uniqueGenres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreDropdown.appendChild(option);
  });

  genreDropdown.addEventListener("change", () => {
    const selectedGenre = genreDropdown.value;
    if (!selectedGenre) {
      renderAllShows(shows);
    } else {
      const filtered = shows.filter((s) => s.genres.includes(selectedGenre));
      renderAllShows(filtered);
      renderDropDown(filtered);
      renderRatingDropdown(filtered);
    }
  });
}

// Details page load
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detailsContainer");
  if (!container) return;

  const showData = localStorage.getItem("selectedShow");
  if (!showData) {
    window.location.href = "index.html";
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
