const API_URL = "https://oil-prices-project-techwithher.s3.amazonaws.com/data/oil_prices.json";

async function loadData() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();

        populateTable(json.today);
        renderWeeklyChart(json.weekly);

    } catch (err) {
        console.error("Error loading data:", err);
    }
}

function populateTable(todayPrices) {
    const tbody = document.querySelector("#currentPricesTable tbody");
    tbody.innerHTML = "";

    todayPrices.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.state}</td><td>$${item.price}</td>`;
        tbody.appendChild(tr);
    });
}

function renderWeeklyChart(weekly) {
    const { labels, data, countries } = weekly;

    const datasets = countries.map((state, i) => ({
        label: state,
        data: data[i],
        borderColor: getColor(i),
        backgroundColor: 'transparent',
        tension: 0.3
    }));

    const ctx = document.getElementById("historicalChart").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: false } }
        }
    });
}

function getColor(i) {
    const colors = ["#6366F1","#EF4444","#10B981","#F59E0B","#3B82F6"];
    return colors[i % colors.length];
}

window.addEventListener("DOMContentLoaded", loadData);