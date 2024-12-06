const products = document.querySelectorAll('.card')

const productArray = Array.from(products).map(product => {
    
    const id = product.getAttribute('data-id')
    const category = product.getAttribute('data-category')
    const name = product.querySelector('.product-name').textContent.trim()
    const price = product.querySelector('.product-price').textContent.trim()
    const description = product.querySelector('.card-description').textContent.trim()

    return { id, category, name, price, description}
})

function productArrayAsJSON (productArray){
    const json = JSON.stringify(productArray, null, 2)
    console.log (json)
}

productArrayAsJSON(productArray)


const descriptionButtons = document.querySelectorAll('.description-btn');

descriptionButtons.forEach(button => {
  button.addEventListener('click', () => {
    
    const cardDescription = button.closest('.card-content').querySelector('.card-description')

    if (cardDescription.style.display === 'none' || !cardDescription.style.display) {
      cardDescription.style.display = 'block'
      cardDescription.style.opacity = '1'
      button.textContent = 'menos info'
    } else {
      cardDescription.style.opacity = '0'
      setTimeout(() => {
        cardDescription.style.display = 'none'
        button.textContent = 'más info'
      }, 100)
    }
  });
});

