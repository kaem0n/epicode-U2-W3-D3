// DOM references

const mainSection = document.getElementById('main-section')
const cardContainer = document.getElementById('card-container')
const spinner = document.getElementById('spinner')
const emptyText = document.getElementById('empty')
const cart1 = document.getElementById('cart1')
const cart2 = document.getElementById('cart2')

// Variables

const books = []

// Functions

const pageLoad = function () {
  fetch('https://striveschool-api.herokuapp.com/books')
    .then((res) => {
      if (res.ok) {
        console.log(res)
        return res.json()
      } else {
        throw new Error('Something went wrong. Code:', res.status)
      }
    })
    .then((data) => {
      console.log(data)
      spinner.classList.add('d-none')
      spinner.classList.remove('d-flex')
      data.forEach((element) => {
        createCard(element)
        books.push(element)
      })
    })
    .catch((err) => {
      spinner.classList.add('d-none')
      spinner.classList.remove('d-flex')
      errorMessage(err)
    })
}

const createCard = function (element) {
  const newCard = document.createElement('div')
  newCard.classList.add('col')
  newCard.innerHTML = `
    <div class="card h-100">
      <img src="${element.img}" class="card-img-top" alt="${element.asin}" />
      <div class="card-body d-flex flex-column justify-content-between pt-2">
        <div class="d-flex flex-column">
          <h5 class="card-title mb-1">${element.title}</h5>
          <span class="badge text-bg-danger align-self-start">Code: ${element.asin}</span>
        </div>
        <div>
          <p class="card-text mb-1">
            <span class="fw-semibold me-1">Price:</span> ${element.price}€
          </p>
          <a href="#" class="btn btn-secondary fw-semibold d-block" onclick="addToCart(event)"
            >Add to Cart</a
          >
        </div>
      </div>
    </div>
  `
  cardContainer.appendChild(newCard)
}

const errorMessage = function (str) {
  const message = document.createElement('h1')
  message.innerText = str
  mainSection.appendChild(message)
}

const addToCart = function (event) {
  const card = event.target.closest('.card-body')
  const bookTitle = card.querySelector('h5').innerText
  const cartItem1 = document.createElement('li')
  const cartItem2 = document.createElement('a')
  cartItem1.classList.add('dropdown-item')
  cartItem2.classList.add('list-group-item')
  cartItem2.classList.add('list-group-item-action')
  for (let i = 0; i < books.length; i++) {
    if (books[i].title === bookTitle) {
      cartItem1.innerHTML = `
        <div
          class="item d-flex justify-content-between align-items-center"
        >
          <div class="me-5">
            <img
              src="${books[i].img}"
              alt="${books[i].asin}"
              height="50px"
            />
            <span class="fw-semibold">${bookTitle}</span>
          </div>
          <a href="#" class="text-danger">
            <i class="bi bi-trash3 fs-5"></i>
          </a>
        </div>
      `
      cartItem2.innerHTML = `
        <div
          class="item d-flex justify-content-between align-items-center"
        >
          <div class="me-5">
            <img
              src="${books[i].img}"
              alt="${books[i].asin}"
              height="50px"
            />
            <span class="fw-semibold">${bookTitle}</span>
          </div>
          <a href="#" class="text-danger">
            <i class="bi bi-trash3 fs-5"></i>
          </a>
        </div>
      `
    }
  }
  cart1.appendChild(cartItem1)
  cart2.appendChild(cartItem2)
  emptyText.classList.add('d-none')
}

// Page load

pageLoad()
