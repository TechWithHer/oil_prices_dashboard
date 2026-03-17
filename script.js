const API_URL = "https://oil-prices-project-techwithher.s3.amazonaws.com/data/oil_prices.json";

async function loadData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const countries = ["US", "India", "China", "Russia", "Singapore"];

        const filtered = data.filter(item => countries.includes(item.country));

        const labels = filtered.map(i => i.country);
        const prices = filtered.map(i => i.price);

        renderTodayChart(labels, prices);
        renderWeeklyChart(labels, prices);

    } catch (err) {
        console.error("Error loading data:", err);
    }
}

function renderTodayChart(labels, values) {
    const ctx = document.getElementById('todayChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price (USD)',
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderWeeklyChart(labels, basePrices) {

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const datasets = labels.map((country, i) => {
        let base = basePrices[i];

        let trend = [];
        let current = base * 0.97;

        for (let j = 0; j < 7; j++) {
            current = current + (Math.random() * 0.8 - 0.3);
            trend.push(Number(current.toFixed(2)));
        }

        return {
            label: country,
            data: trend,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 2
        };
    });

    const ctx = document.getElementById('weeklyChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// IMPORTANT: call function
loadData();