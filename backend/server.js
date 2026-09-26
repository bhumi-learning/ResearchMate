const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


app.get("/api/search", async (req, res) => {

    const query = req.query.q;

    if (!query) {

        return res.status(400).json({
            error: "Search query is required."
        });

    }


    // Temporary demo research results
    const demoResults = [

        {
            title: `Introduction to ${query}`,
            link:
                "https://www.google.com/search?q=" +
                encodeURIComponent(query),

            source: "Google Search",

            snippet:
                `Learn the basics, concepts, and important information about ${query}.`
        },


        {
            title: `${query} - Research Overview`,
            link:
                "https://www.google.com/search?q=" +
                encodeURIComponent(query),

            source: "Research Sources",

            snippet:
                `Explore useful information and research sources related to ${query}.`
        },


        {
            title: `Latest Information About ${query}`,
            link:
                "https://www.google.com/search?q=" +
                encodeURIComponent(query),

            source: "Web Research",

            snippet:
                `Find articles, resources, and additional information about ${query}.`
        }

    ];


    res.json({
        results: demoResults
    });

});


app.listen(PORT, () => {

    console.log(
        `ResearchMate backend running at http://localhost:${PORT}`
    );

});