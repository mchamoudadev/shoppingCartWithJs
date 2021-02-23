const cartDOM = document.querySelector(".cart__items");
const addToCartBtn = document.querySelectorAll(".btn__add__to__cart");
const cartCounter = document.querySelector(".cart__counter");
const totalCost = document.querySelector(".total__cost");
const totalCount = document.querySelector("#total__counter");
const checkOutBtn = document.querySelector(".check_out_btn");

// assign all values from local stoarge
let cartItems = (JSON.parse(localStorage.getItem("cart_items")) || []);


document.addEventListener("DOMContentLoaded", loadData);


checkOutBtn.addEventListener("click", () =>  {
    alert("Your Order Sent Succesfully");
    clearCartItems();
})

cartCounter.addEventListener("click", () => {
    cartDOM.classList.toggle("active");
})

addToCartBtn.forEach(btn => {

    btn.addEventListener("click", () => {
        let parentElement = btn.parentElement;

        const product = {
            id: parentElement.querySelector("#product__id").value,
            name: parentElement.querySelector(".product__name").innerText,
            image: parentElement.querySelector("#image").getAttribute("src"),
            price: parentElement.querySelector(".product__price").innerText.replace("$", ""),
            quantity: 1
        }

        let isIncart = cartItems.filter(item => item.id === product.id).length > 0;

        // check if alreday Exists
        if (!isIncart) {
            addItemToTheDOM(product);
        } else {
            alert("Product Already in the Cart");
            return;
        }

        const cartDOMItems = document.querySelectorAll(".cart_item");

        cartDOMItems.forEach(individualItem => {
            if (individualItem.querySelector("#product__id").value === product.id) {
                // increrase
                increaseItem(individualItem,product);
                // decrease
                decreaseItem(individualItem,product);
                // Removing Element
                removeItem(individualItem,product);
                
            }
        })

        cartItems.push(product);
        calculateTotal();
        saveToLocalStorage();
    });

})

function loadData() {
    if(cartItems.length > 0 ){
        cartItems.forEach( product => {
            addItemToTheDOM(product);
    
            const cartDOMItems = document.querySelectorAll(".cart_item");
    
            cartDOMItems.forEach(individualItem => {
                if (individualItem.querySelector("#product__id").value === product.id) {
                    // increrase
                    increaseItem(individualItem,product);
                    // decrease
                    decreaseItem(individualItem,product);
                    // Removing Element
                    removeItem(individualItem,product);
                   
                }
            });
        });
        calculateTotal();
    }
}

function calculateTotal() {
    let total = 0;
    cartItems.forEach( item => {
        total += item.quantity * item.price;
    });
    totalCost.innerText= total;
    totalCount.innerText = cartItems.length;

}

function saveToLocalStorage(){

    localStorage.setItem("cart_items", JSON.stringify(cartItems));

}
function clearCartItems(){

    localStorage.clear();
    cartItems = [];

    document.querySelectorAll(".cart__items").forEach( item => {

        item.querySelectorAll(".cart_item").forEach( node =>{
            node.remove();
        });

    });
    cartDOM.classList.toggle("active");
    calculateTotal();
    

}

function addItemToTheDOM(product){
    // Adding the new Item to the Dom
    cartDOM.insertAdjacentHTML("afterbegin", `<div class="cart_item">
            <input type="hidden" id="product__id" value="${product.id}">
           <img id="product_image" src="${product.image}" alt="" srcset="">
           <h4 class="product__name">${product.name}</h4>
           <a class="btn__small" action="decrease">&minus;</a> <h4 class="product__quantity">${product.quantity}</h4><a class="btn__small" action="increase">&plus;</a>
          <span id="product__price">${product.price}</span>
           <a class="btn__small btn_remove" action="remove">&times;</a>
       </div>`);
}

function increaseItem(individualItem, product){

    individualItem.querySelector("[action='increase']").addEventListener('click', () => {
        // Actual Array
        cartItems.forEach(cartItem => {
            if (cartItem.id === product.id) {
                individualItem.querySelector(".product__quantity").innerText = ++cartItem.quantity;
                calculateTotal();     
                saveToLocalStorage();   
            }
        })
    });

}

function decreaseItem(individualItem,product){

    individualItem.querySelector("[action='decrease']").addEventListener('click', () => {
        // all cart items in the dom
        cartItems.forEach(cartItem => {
            // Actual Array
            if (cartItem.id === product.id) {
                if (cartItem.quantity > 1) {
                    individualItem.querySelector(".product__quantity").innerText = --cartItem.quantity;
                    calculateTotal();
                    saveToLocalStorage();
                } else {
                    // removing this element and assign the new elemntos to the old of the array
                    console.log(cartItems);

                    cartItems = cartItems.filter(newElements => newElements.id !== product.id);
                    individualItem.remove();

                    calculateTotal();
                    saveToLocalStorage();

                }

            }
        })
    });
}

function removeItem(individualItem, product){

    individualItem.querySelector("[action='remove']").addEventListener('click', () => {
        cartItems.forEach(cartItem => {
            if (cartItem.id === product.id) {
                cartItems = cartItems.filter(newElements => newElements.id !== product.id);
                individualItem.remove();
                calculateTotal();
                saveToLocalStorage();
            }
        })
    });
}