const API_URL = "https://oil-prices-project-techwithher.s3.amazonaws.com/data/oil_prices.json";

async function loadData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const countries = ["US", "India", "China", "Russia", "Singapore"];

        // Filter only required countries
        const filtered = data.filter(item => countries.includes(item.country));

        const labels = filtered.map(i => i.country);
        const prices = filtered.map(i => i.price);

        renderTodayChart(labels, prices);
        renderWeeklyChart(labels, prices);

    } catch (err) {
        console.error(err);
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

    // Create fake variation (temporary)
    const datasets = labels.map((country, i) => {
        let base = basePrices[i];

        return {
            label: country,
            data: days.map((_, idx) => {
                return (base * (0.98 + Math.random() * 0.04)).toFixed(2);
            }),
            tension: 0.3
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
            }
        }
    });
}

loadData();