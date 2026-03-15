async function loadData() {

const response = await fetch("data/oil_prices.json")
const data = await response.json()

const countries = data.map(d => d.country)
const prices = data.map(d => d.price)

new Chart(document.getElementById("oilChart"), {
type: "bar",
data: {
labels: countries,
datasets: [{
label: "Oil Price USD",
data: prices
}]
}
})

}

loadData()

const images = [
"images/oil1.jpg",
"images/oil2.jpg",
"images/oil3.jpg",
"images/oil4.jpg"
]

function rotateImages(){

const img = document.getElementById("rotatingImage")

setInterval(()=>{
const random = Math.floor(Math.random()*images.length)
img.src = images[random]
},3000)

}

rotateImages()