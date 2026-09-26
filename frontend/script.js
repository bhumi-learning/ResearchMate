const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");

const resultsContainer = document.getElementById("resultsContainer");

const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const resultCount = document.getElementById("resultCount");

const historyContainer = document.getElementById("historyContainer");
const clearHistoryButton = document.getElementById("clearHistoryButton");


// Load Search History
function loadSearchHistory() {

    const history =
        JSON.parse(localStorage.getItem("researchHistory")) || [];

    if (history.length === 0) {

        historyContainer.innerHTML =
            "<p>No recent searches yet.</p>";

        return;
    }


    historyContainer.innerHTML =
        history.map(item => `

            <button class="history-item">
                ${item}
            </button>

        `).join("");


    // Click a history item
    document.querySelectorAll(".history-item").forEach(button => {

        button.addEventListener("click", () => {

            searchInput.value = button.textContent.trim();

            searchButton.click();

        });

    });

}


// Save Search History
function saveSearchHistory(query) {

    let history =
        JSON.parse(localStorage.getItem("researchHistory")) || [];


    // Remove duplicate searches
    history = history.filter(item => item !== query);


    // Add latest search at the beginning
    history.unshift(query);


    // Keep only latest 5 searches
    history = history.slice(0, 5);


    localStorage.setItem(
        "researchHistory",
        JSON.stringify(history)
    );


    loadSearchHistory();

}


// Search Button
searchButton.addEventListener("click", async () => {

    const query = searchInput.value.trim();


    // Empty search check
    if (!query) {

        resultsContainer.innerHTML =
            "<p>Please enter a search query.</p>";

        resultCount.textContent =
            "0 results";

        return;
    }


    // Save search
    saveSearchHistory(query);


    // Disable button while searching
    searchButton.disabled = true;
    searchButton.textContent = "Searching...";


    // Show loading
    resultsContainer.innerHTML =
        "<p>Searching...</p>";

    loadingMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");


    try {

        const response = await fetch(
            `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
        );


        const data = await response.json();


        // Hide loading
        loadingMessage.classList.add("hidden");


        if (!response.ok) {

            throw new Error(
                data.error || "Search failed."
            );

        }


        // No results
        if (!data.results || data.results.length === 0) {

            resultsContainer.innerHTML =
                "<p>No results found.</p>";

            resultCount.textContent =
                "0 results";

            return;
        }


        // Result count
        resultCount.textContent =
            `${data.results.length} results`;


        // Display results
        resultsContainer.innerHTML =
            data.results.map((result, index) => `

                <div class="result-card">

                    <h3>

                        <span class="result-number">
                            #${index + 1}
                        </span>

                        <a
                            href="${result.link}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${result.title}
                        </a>

                    </h3>


                    <p class="result-source">
                        Source: ${result.source || "Web Research"}
                    </p>


                    <p>
                        ${result.snippet || ""}
                    </p>


                    <a
                        class="open-source-button"
                        href="${result.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Source ↗
                    </a>

                </div>

            `).join("");


    } catch (error) {

        console.error(error);


        loadingMessage.classList.add("hidden");


        errorMessage.textContent =
            "Something went wrong. Please try again.";


        errorMessage.classList.remove("hidden");


        resultsContainer.innerHTML =
            "";


        resultCount.textContent =
            "0 results";

    } finally {

        // Enable search button again
        searchButton.disabled = false;

        searchButton.textContent =
            "Search";

    }

});


// Clear Search Button
clearButton.addEventListener("click", () => {

    searchInput.value = "";


    resultsContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                📚
            </div>

            <h3>
                Start Your Research
            </h3>

            <p>
                Enter a topic above to discover
                useful information and sources.
            </p>

            <div class="research-tip">
                💡 Tip: Try specific topics for more focused results.
            </div>

        </div>

    `;


    resultCount.textContent =
        "0 results";


    loadingMessage.classList.add("hidden");

    errorMessage.classList.add("hidden");


    searchInput.focus();

});


// Clear History Button
clearHistoryButton.addEventListener("click", () => {

    localStorage.removeItem("researchHistory");

    loadSearchHistory();

});


// Press Enter to Search
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchButton.click();

    }

});


// Load history when page opens
loadSearchHistory();