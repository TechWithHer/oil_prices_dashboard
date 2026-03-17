// URL of your Lambda JSON
const API_URL = "https://oil-prices-project-techwithher.s3.amazonaws.com/data/oil_prices.json";

// Main function to load data
async function loadData() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        // Select only these countries
        const countries = ["US", "India", "China", "Russia", "Singapore"];
        const filtered = data.filter(item => countries.includes(item.country));

        const labels = filtered.map(i => i.country);
        const prices = filtered.map(i => i.price);

        // Populate today's prices table
        populateTable(filtered);

        // Render weekly trend chart with fake data for now
        renderWeeklyChart(labels, prices);

    } catch (err) {
        console.error("Error loading data:", err);
        const tbody = document.querySelector("#currentPricesTable tbody");
        tbody.innerHTML = `<tr><td colspan="2">Failed to load data</td></tr>`;
    }
}

// Populate the "Today's Prices" table
function populateTable(data) {
    const tbody = document.querySelector("#currentPricesTable tbody");
    tbody.innerHTML = ""; // Clear old data

    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.country}</td><td>$${item.price}</td>`;
        tbody.appendChild(tr);
    });
}

// Generate a weekly trend chart (fake data for now)
function renderWeeklyChart(countries, basePrices) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const datasets = countries.map((country, i) => {
        const base = basePrices[i];
        let trend = [];
        let current = base * 0.97; // start slightly lower

        for (let j = 0; j < 7; j++) {
            current = current + (Math.random() * 0.8 - 0.3); // small variation
            trend.push(Number(current.toFixed(2)));
        }

        return {
            label: country,
            data: trend,
            borderColor: getRandomColor(i),
            backgroundColor: 'transparent',
            tension: 0.3
        };
    });

    const ctx = document.getElementById("historicalChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: days,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

// Helper: pick a distinct color per country
function getRandomColor(index) {
    const colors = ["#6366F1", "#EF4444", "#10B981", "#F59E0B", "#3B82F6"];
    return colors[index % colors.length];
}

// Load data when page loads
window.addEventListener("DOMContentLoaded", loadData);