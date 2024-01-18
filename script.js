// DOM references

const mainSection = document.getElementById('main-section')
const cardContainer = document.getElementById('card-container')
const spinner = document.getElementById('spinner')
const cart1 = document.getElementById('cart1')
const cart2 = document.getElementById('cart2')
const emptyText1 = document.getElementById('empty1')
const emptyText2 = document.getElementById('empty2')
const confirmButton1 = document.getElementById('confirm1')
const confirmButton2 = document.getElementById('confirm2')

// Variables

const books = []
let cart = []
const cartItemIndexes = []

// Functions

const pageLoad = function () {
  fetch('https://striveschool-api.herokuapp.com/books')
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Something went wrong. Code:', res.status)
      }
    })
    .then((data) => {
      spinner.classList.add('d-none')
      spinner.classList.remove('d-flex')
      data.forEach((element) => {
        createCard(element)
        books.push(element)
      })
      if (localStorage.getItem('cart')) {
        cart = [...JSON.parse(localStorage.getItem('cart'))]
        for (let i = 0; i < cart.length; i++) {
          cartItemIndexes.push(i)
          const cartItem1 = document.createElement('li')
          const cartItem2 = document.createElement('a')
          cartItem1.classList.add('dropdown-item')
          cartItem2.classList.add('list-group-item')
          cartItem2.classList.add('list-group-item-action')
          cartItemGen(cartItem1, cart[i], i)
          cartItemGen(cartItem2, cart[i], i)
          cart1.appendChild(cartItem1)
          cart2.appendChild(cartItem2)
        }
        emptyText1.classList.add('d-none')
        emptyText2.classList.add('d-none')
        confirmButton1.disabled = false
        confirmButton2.disabled = false
      }
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
          <h5 class="card-title mb-0">${element.title}</h5>
          <p class="mb-1 fw-semibold"><span class="text-secondary">Category:</span> Sci-Fi</p>
          <span class="badge text-bg-danger align-self-start">Code: ${element.asin}</span>
        </div>
        <div class="d-flex flex-column">
          <p class="card-text mb-1">
            <span class="fw-semibold me-1">Price:</span> ${element.price}€
          </p>
          <button class="btn btn-secondary fw-semibold" onclick="addToCart(event)"
            >Add to Cart</button
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

const cartItemGen = function (item, arrayElement, index) {
  item.innerHTML = `
    <div
      class="item${index} d-flex justify-content-between align-items-center"
    >
      <div class="me-5 d-flex">
        <img
          src="${arrayElement.img}"
          alt="${arrayElement.asin}"
          height="50px"
        />
        <div class="d-flex flex-column ms-2">
          <span class="fw-semibold">${arrayElement.title}</span>
          <span class="badge text-bg-danger align-self-start">Code: ${arrayElement.asin}</span>
        </div>
      </div>
      <a href="#" class="text-danger" onclick="deleteFromCart(event)">
        <i class="bi bi-trash3 fs-5"></i>
      </a>
    </div>
  `
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
      cartItemGen(cartItem1, books[i], i)
      cartItemGen(cartItem2, books[i], i)
      cart.push(books[i])
      cartItemIndexes.push(i)
    }
  }
  cart1.appendChild(cartItem1)
  cart2.appendChild(cartItem2)
  emptyText1.classList.add('d-none')
  emptyText2.classList.add('d-none')
  confirmButton1.disabled = false
  confirmButton2.disabled = false
  localStorage.setItem('cart', JSON.stringify(cart))
  console.log(JSON.parse(localStorage.getItem('cart')))
}

const deleteFromCart = function (event) {
  for (let i = 0; i < cart.length; i++) {
    if (event.target.closest(`.item${cartItemIndexes[i]}`)) {
      const itemsToDelete = document.getElementsByClassName(
        `item${cartItemIndexes[i]}`
      )
      for (let j = 0; j < itemsToDelete.length; j++) {
        itemsToDelete[j].closest('.dropdown-item').remove()
        itemsToDelete[j].closest('.list-group-item').remove()
        cart.splice(i, 1)
        cartItemIndexes.splice(i, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
      }
      if (cart.length === 0) {
        localStorage.removeItem('cart')
        emptyText1.classList.remove('d-none')
        emptyText2.classList.remove('d-none')
        confirmButton1.disabled = true
        confirmButton2.disabled = true
      }
    }
  }
}

// Page load

pageLoad()
