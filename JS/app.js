// 1. Product Array and JSON Logging (unchanged from before)
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
logProductArrayAsJSON(); // Log the product array as JSON to console

// 2. Cart Drawer Trigger
const buyButtons = document.querySelectorAll('.add-to-cart-btn'); // Select all "buy" buttons
const cartItemsContainer = document.getElementById('buyItems'); // Container for cart items
const totalPriceElement = document.getElementById('total-carrito'); // Element to display total price
const emptyCartMessage = document.querySelector('.empty'); // Empty cart message element

let cart = []; // Cart array to hold products
let total = 0; // Variable to track the total price

// Add event listener to each "buy" button
buyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productKey = button.getAttribute('data-product-key');
    const product = productArray.find(p => p.name.toLowerCase() === productKey.toLowerCase()); // Get the product by name

    // Check if product is already in the cart
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
      // If the product is already in the cart, increase the quantity and update total
      existingProduct.quantity += 1;
    } else {
      // If the product is not in the cart, add it with quantity 1
      product.quantity = 1; // Set initial quantity
      cart.push(product);
    }

    // Update the total price
    total += product.price;

    // Update cart display
    renderCart();

    // Trigger the Bootstrap offcanvas to open when the "buy" button is clicked
    const cartDrawer = new bootstrap.Offcanvas(document.getElementById('staticBackdrop'));
    cartDrawer.show(); // Show the cart drawer
  });
});

// 3. Render the cart and update the display
function renderCart() {
  // Clear current cart items (to avoid leftover products)
  cartItemsContainer.innerHTML = ''; 

  // Debug log for cart length
  console.log('Cart Length:', cart.length);

  // If the cart is empty, show the empty cart message
  if (cart.length === 0) {
    console.log('Cart is empty, showing empty message');
    emptyCartMessage.style.display = 'block'; // Show empty cart message
    totalPriceElement.textContent = '0'; // Reset total to 0
  } else {
    console.log('Cart has items, hiding empty message');
    emptyCartMessage.style.display = 'none'; // Hide empty cart message
  }

  // Loop through each product in the cart and display it
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
        <button class="mas">+</button><p class="qty">${product.quantity}</p><button class="menos">-</button>
      </div>
    `;

    // Add event listener to "+" button to increase the quantity
    li.querySelector('.mas').addEventListener('click', () => {
      product.quantity += 1;
      total += product.price; // Add product price to total
      renderCart(); // Re-render the cart to update the quantity and total
    });

    // Add event listener to "-" button to decrease the quantity
    li.querySelector('.menos').addEventListener('click', () => {
      if (product.quantity > 1) { // Prevent quantity from going below 1
        product.quantity -= 1;
        total -= product.price; // Subtract product price from total
        renderCart(); // Re-render the cart to update the quantity and total
      } else if (product.quantity === 1) {
        // Remove product from cart if quantity is 0
        cart = cart.filter(item => item.name !== product.name); // Remove product from cart
        total -= product.price; // Subtract the product price from total
        renderCart(); // Re-render the cart to reflect removal and updated total
      }
    });

    // Append item to the cart
    cartItemsContainer.appendChild(li);
  });

  // Update the total price in the total element
  totalPriceElement.textContent = total.toFixed(0); // Update the total price
}


// 4. See More Button Functionality (unchanged)
const descriptionButtons = document.querySelectorAll('.description-btn');

descriptionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const cardDescription = button.closest('.card-content').querySelector('.card-description');
    
    // Toggle visibility of the description text
    if (cardDescription.style.display === 'none' || !cardDescription.style.display) {
      cardDescription.style.display = 'block';
      cardDescription.style.opacity = '1';
      button.textContent = 'menos info'; // Change text to "less info"
    } else {
      cardDescription.style.opacity = '0';
      setTimeout(() => {
        cardDescription.style.display = 'none';
        button.textContent = 'más info'; // Change text to "more info"
      }, 100);
    }
  });
});
