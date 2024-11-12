// 1. Carrusel para el banner (slider)
let currentSlide = 0;  
const slides = document.querySelectorAll('.slider img');  

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'block' : 'none';  
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;  
    showSlide(currentSlide);
}

setInterval(nextSlide, 5000); // Cambia de imagen cada 5 segundos

// 2. Carrusel para los productos destacados
let currentProductIndex = 0;
const products = document.querySelectorAll('.product-list .product');  
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function showProducts(index) {
    products.forEach((product, i) => {
        product.style.display = (i >= index && i < index + 6) ? 'block' : 'none';
    });
}

function nextProduct() {
    currentProductIndex = (currentProductIndex + 6) % products.length; // Muestra los siguientes 6 productos
    showProducts(currentProductIndex);
}

function prevProduct() {
    currentProductIndex = (currentProductIndex - 6 + products.length) % products.length; // Muestra los productos anteriores
    showProducts(currentProductIndex);
}

nextBtn.addEventListener('click', nextProduct);
prevBtn.addEventListener('click', prevProduct);

showProducts(currentProductIndex); 

// Agregar evento a los productos destacados para añadir al carrito
const featuredProducts = document.querySelectorAll('.product-list .product');

featuredProducts.forEach(product => {
    const buyNowButton = product.querySelector('.buy-now');
    if (buyNowButton) {
        buyNowButton.addEventListener('click', addToCart);
    }
});

// 3. Sistema de chat básico
document.getElementById('chat-icon').addEventListener('click', () => {
    const chatBox = document.getElementById('chat-box');
    chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
});

// 4. Funcionalidad de categorías
const categoryButtons = document.querySelectorAll('.category button');  
const categoryProductsSection = document.getElementById('category-products');  
const cart = [];
const cartWindow = document.getElementById('cart-window'); 
const cartContent = document.getElementById('cart-content'); 
const checkoutButton = document.getElementById('checkout-button'); 

const allProducts = {
    'Controladores': [
        { name: 'Controlador 10 A', image: 'controlador.png', price: '$49,99' },
        { name: 'Controlador 20 A', image: 'controlador.png', price: '$69,99' },
        { name: 'Controlador 30 A', image: 'controlador.png', price: '$79,99' },
    ],
    'Inversores': [
        { name: 'Inversor 3000w amarillo', image: '3000.png', price: '$169,99' },
        { name: 'Inversor 3000w negro', image: '30000.png', price: '$179,99' },
        { name: 'Inversor 4000w con pantalla LCD', image: '40000.png', price: '$259,99' },
        { name: 'Inversor 4000w con pantalla LCD' , image: '4000.png', price: '$259,99' },
    ],
    'Otros': [
        { name: 'Panel solar 300w', image: 'panel.png', price: '$99,99' },
        { name: 'Combo panel solar 2000w', image: 'combo.png', price: '$369,99' },
        { name: 'Combo panel solar 3000w', image: 'combo.png', price: '$299,99' },
        { name: 'Combo panel solar 4000w', image: 'combo.png', price: '$369,99' },
        { name: 'Combo panel solar 5000w', image: 'combo.png', price: '$499,99' },
        { name: 'Cargador de batería 6A', image: 'otros.png', price: '$39,99' },
        { name: 'Cargador de batería 8A', image: 'otros.png', price: '$59,99' },
        { name: 'Cargador de batería 10A', image: 'otros.png', price: '$79,99' },
    ]
};

categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        const category = this.textContent;
        loadProductsByCategory(category);
    });
});

function loadProductsByCategory(category) {
    categoryProductsSection.innerHTML = `<h3>Productos de la categoría: ${category}</h3>`;

    const filteredProducts = allProducts[category] || [];

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <p class="price">${product.price}</p>
            <button class="buy-now" data-name="${product.name}" data-image="${product.image}" data-price="${product.price}">Comprar Ahora</button>
        `;
        categoryProductsSection.appendChild(productElement);
    });

    const buyNowButtons = document.querySelectorAll('.buy-now');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function addToCart(event) {
    const productName = event.target.getAttribute('data-name');
    const productImage = event.target.getAttribute('data-image');
    const productPrice = event.target.getAttribute('data-price');
    
    const existingProductIndex = cart.findIndex(item => item.name === productName);
    
    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1; // Aumentar cantidad si ya está en el carrito
    } else {
        const product = { name: productName, image: productImage, price: productPrice, quantity: 1 };
        cart.push(product); // Añadir producto nuevo al carrito
    }
    updateCart(); // Actualizar la vista del carrito
}

function updateCart() {
    cartContent.innerHTML = ''; 
    let total = 0; 

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace('$', '')) * (item.quantity || 1); 
        total += itemTotal; 

        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <h4>${item.name}</h4>
            <button class="increase-quantity" data-index="${index}">+</button>
            <p class="quantity">${item.quantity || 1}</p> 
            <button class="decrease-quantity" data-index="${index}">-</button>
            <p class="price">${item.price}</p>
            <button class="remove-item" data-index="${index}">Eliminar</button>
        `;
        cartContent.appendChild(cartItem);
    });

    const totalElement = document.createElement('div');
    totalElement.innerHTML = `<h4>Total de la compra: $${total.toFixed(2)}</h4>`;
    cartContent.appendChild(totalElement);

    const removeButtons = document.querySelectorAll('.remove-item');
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            removeItemFromCart(index);
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            cart[index].quantity = (cart[index].quantity || 1) + 1;
            updateCart();
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });

    if (cart.length > 0) {
        cartWindow.style.display = 'block'; // Mostrar carrito si hay productos
    } else {
        cartWindow.style.display = 'none'; // Ocultar carrito si está vacío
    }
}

function removeItemFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

// Funcionalidad para finalizar compra
checkoutButton.addEventListener('click', finalizePurchase);

async function finalizePurchase() {
    let orderDetails = 'Orden de compra:\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = parseFloat(item.price.replace('$', '')) * (item.quantity || 1);
        total += itemTotal;
        orderDetails += `${item.name} - ${item.price} x ${item.quantity}\n`;
    });

    orderDetails += `\nTotal de la compra: $${total.toFixed(2)}`;

    const whatsappNumber = '5930987386277'; // Número de WhatsApp para recibir la orden
    const message = `Aquí está tu orden de compra:\n${orderDetails}`;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank'); // Abrir WhatsApp con el mensaje de la orden
}

// Inicializar la ventana del carrito oculta
cartWindow.style.display = 'none';

// Botón para abrir el carrito
const openCartButton = document.getElementById('open-cart');
openCartButton.addEventListener('click', () => {
    cartWindow.style.display = cartWindow.style.display === 'none' ? 'block' : 'none';
});

// Botón para cerrar el carrito
const closeCartButton = document.getElementById('close-cart');
closeCartButton.addEventListener('click', () => {
    cartWindow.style.display = 'none'; // Cerrar ventana del carrito
});

// Envío de información del formulario de contacto por correo
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    // Aquí puedes añadir tu lógica para enviar el correo
    alert(`Mensaje enviado: ${message}\nDesde: ${name} (${email})`);
    
    contactForm.reset(); // Resetear el formulario después del envío
});

// Envío de información de compra por WhatsApp al finalizar
checkoutButton.addEventListener('click', () => {
    const orderDetails = cart.map(item => `${item.name} - ${item.price} x ${item.quantity || 1}`).join(', ');
    alert(`Compra realizada: ${orderDetails}`);
});

// Implementación de IA para el chatbot (Simulación)
const chatResponses = {
    'Hola': '¡Hola! ¿En qué puedo ayudarte?',
    '¿Qué productos tienen?': 'Tenemos una variedad de celulares y accesorios.',
    'Ayuda': 'Claro, por favor cuéntame qué necesitas.'
};

document.getElementById('chat-send').addEventListener('click', () => {
    const userInput = document.getElementById('chat-input').value;
    const response = chatResponses[userInput] || 'Lo siento, no entendí tu pregunta.';
    document.getElementById('chat-log').innerHTML += `<div>Usuario: ${userInput}</div><div>Bot: ${response}</div>`;
    document.getElementById('chat-input').value = ''; // Limpiar el campo de entrada
});
