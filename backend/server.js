const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// Search API
app.get("/api/search", async (req, res) => {

    const query = req.query.q;


    // Check search query
    if (!query) {

        return res.status(400).json({
            error: "Search query is required."
        });

    }


    // Check SerpApi key
    if (!process.env.SERPAPI_KEY) {

        return res.status(500).json({
            error: "SerpApi API key is not configured."
        });

    }


    try {

        const serpApiUrl =
            "https://serpapi.com/search.json" +
            "?engine=google" +
            "&q=" +
            encodeURIComponent(query) +
            "&api_key=" +
            encodeURIComponent(process.env.SERPAPI_KEY);


        const response = await fetch(serpApiUrl);


        const data = await response.json();


        // SerpApi API error
        if (!response.ok) {

            console.error("SerpApi error:", data);

            return res.status(response.status).json({
                error:
                    data.error ||
                    "SerpApi search request failed."
            });

        }


        // Convert SerpApi results into our app format
        const results =
            (data.organic_results || [])
                .slice(0, 5)
                .map(result => ({

                    title:
                        result.title || "Untitled Result",

                    link:
                        result.link || "#",

                    source:
                        result.displayed_link ||
                        "Google Search",

                    snippet:
                        result.snippet ||
                        "No description available."

                }));


        res.json({
            query: query,
            results: results
        });


    } catch (error) {

        console.error("Search error:", error);


        res.status(500).json({
            error:
                "Unable to fetch research results."
        });

    }

});


app.listen(PORT, () => {

    console.log(
        `ResearchMate backend running at http://localhost:${PORT}`
    );

});