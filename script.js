const countries = ["US", "China", "India", "Russia", "Singapore", "UAE", "Iran"];

  fetch("data/oil_prices.json")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("oilTable");

    data.forEach(item => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.country}</td>
        <td>$${item.price}</td>
      `;

      table.appendChild(row);
    });
  })
  .catch(err => console.error(err));