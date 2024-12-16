
const products = document.querySelectorAll('.card');

const productArray = Array.from(products).map(product => {
  const id = product.getAttribute('data-id');
  const category = product.getAttribute('data-category');
  const name = product.querySelector('.product-name').textContent.trim();
  const price = parseFloat(product.querySelector('.product-price').textContent.trim().replace('$', ''));
  const description = product.querySelector('.card-description').textContent.trim();

  return { id, category, name, price, description };
});

function logProductArrayAsJSON() {
  console.log(JSON.stringify(productArray, null, 2));
}
logProductArrayAsJSON();


const buyButtons = document.querySelectorAll('.add-to-cart-btn'); 
const cartItemsContainer = document.getElementById('buyItems'); 
const totalPriceElement = document.getElementById('total-carrito');
const emptyCartMessage = document.querySelector('.empty');

let cart = JSON.parse(localStorage.getItem('cart')) || []; 
let total = parseFloat(localStorage.getItem('total')) || 0; 

renderCart()

buyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productKey = button.getAttribute('data-product-key');
    const product = productArray.find(p => p.name.toLowerCase() === productKey.toLowerCase()); // Get the product by name

    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    total += product.price;

    saveCartState();

    renderCart();
    const cartDrawer = new bootstrap.Offcanvas(document.getElementById('staticBackdrop'));
    cartDrawer.show();
  });
});

function renderCart() {
  cartItemsContainer.innerHTML = ''; 

  console.log('Cart Length:', cart.length);

  const checkoutButton = document.querySelector('.checkout');

  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block'; 
    totalPriceElement.textContent = '0'; 
    checkoutButton.classList.add('hidden');
    localStorage.setItem('total', '0.00');

  } else {
    emptyCartMessage.style.display = 'none'; 
    checkoutButton.classList.remove('hidden');
  }

  cart.forEach(product => {
    const li = document.createElement('li');
    li.classList.add('buyItem');
    li.innerHTML = `
      <div>
        <h5>${product.name}</h5>
        <h6>$${product.price}</h6>
      </div>
      <br>
      <div id="qty-buttons">
        <button class="mas">+ </button><p class="qty">${product.quantity}</p><button class="menos"> -</button>
      </div>
    `;

    li.querySelector('.mas').addEventListener('click', () => {
      product.quantity += 1;
      total += product.price; 
      saveCartState();
      renderCart(); 
    });

    li.querySelector('.menos').addEventListener('click', () => {
      if (product.quantity > 1) { 
        product.quantity -= 1;
        total -= product.price;
        saveCartState();
        renderCart(); 
      } else if (product.quantity === 1) {

        cart = cart.filter(item => item.name !== product.name); 
        total -= product.price; 
        saveCartState();
        renderCart();
      }
    });

    cartItemsContainer.appendChild(li);
  });

  totalPriceElement.textContent = total.toFixed(0); 
}

function saveCartState() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('total', total.toFixed(2));
}

function mostrarCheckout() {
  const carrito = JSON.parse(localStorage.getItem('cart')) || [];

  if (carrito.length === 0) {
    checkoutButton.classList.add('hidden');
    return;
  }

  const modal = document.getElementById('checkout-modal');
  modal.style.display = 'flex';

  const modalProductList = document.getElementById('modal-product-list');
  modalProductList.innerHTML = '';

  carrito.forEach(product => {
    const li = document.createElement('li');
    li.textContent = `${product.name} - $${product.price} x ${product.quantity}`;
    modalProductList.appendChild(li);
  });

  const modalTotal = document.getElementById('modal-total');
  const total = carrito.reduce((acc, product) => acc + product.price * product.quantity, 0);
  modalTotal.textContent = total.toFixed(2);
}

function cerrarCheckout() {
  const modal = document.getElementById('checkout-modal');
  modal.style.display = 'none';

  renderCart();
}

function realizarCompra() {
  alert('Gracias por su compra');

  localStorage.removeItem('cart');
  localStorage.removeItem('total');
  sessionStorage.clear();

  cart = [];
  total = 0;

  renderCart();
  cerrarCheckout();
}




const descriptionButtons = document.querySelectorAll('.description-btn');

descriptionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const cardDescription = button.closest('.card-content').querySelector('.card-description');
    
    if (cardDescription.style.display === 'none' || !cardDescription.style.display) {
      cardDescription.style.display = 'block';
      cardDescription.style.opacity = '1';
      button.textContent = 'menos info'; 
    } else {
      cardDescription.style.opacity = '0';
      setTimeout(() => {
        cardDescription.style.display = 'none';
        button.textContent = 'más info'; 
      }, 100);
    }
  });
});
