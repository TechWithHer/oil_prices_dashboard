const API_URL = "https://oil-prices-project-techwithher.s3.amazonaws.com/data/oil_prices.json";

async function loadOilData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        console.log("Data from S3:", data);

        // Extract values
        const countries = data.map(item => item.country);
        const prices = data.map(item => item.price);

        renderChart(countries, prices);
        renderTable(data);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function renderChart(labels, values) {
    const ctx = document.getElementById('oilChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Oil Price (USD)',
                data: values,
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
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

function renderTable(data) {
    const table = document.getElementById("oilTable");

    let html = `
        <tr>
            <th>Country</th>
            <th>Price (USD)</th>
        </tr>
    `;

    data.forEach(item => {
        html += `
            <tr>
                <td>${item.country}</td>
                <td>${item.price}</td>
            </tr>
        `;
    });

    table.innerHTML = html;
}

// Load data on page load
loadOilData();