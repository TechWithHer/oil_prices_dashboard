const countries = ["US", "China", "India", "Russia", "Singapore", "UAE", "Iran"];

fetch("data/oil_prices.json")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("oilTable");

    countries.forEach(country => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${country}</td>
        <td>$${data[country] || "N/A"}</td>
      `;
      table.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error fetching oil prices:", error);
  });