//Storage Controller
const StorageController = (function(){

    return{
        storeProduct: function(product){
            let products = [];
            
            if(localStorage.getItem('products') === null){
                products.push(product);
            }else{
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            };

            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function(){
            let products;

             if(localStorage.getItem("products") === null){
                products = [];
             }else{
                products = JSON.parse(localStorage.getItem("products"));
             };

             return products;
        },
        updateProduct: function(updatedProduct){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((item, index) => {
                if(updatedProduct.id == item.id){
                    products.splice(index, 1, updatedProduct)
                };
            });

            localStorage.setItem('products', JSON.stringify(products));
        },
        deleteProduct: function(id){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((item, index) => {
                if(id == item.id){
                    products.splice(index, 1);
                };
            });

            localStorage.setItem('products', JSON.stringify(products));
        }
    };

})();

// Product Controller
const ProductController = (function(){
    let Product = function(id, name, price){
        this.id = id;
        this.name = name;
        this.price = price;
    };

    let data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    };

    return{
        getProducts: function(){
            return data.products;
        },
        getData: function(){
            return data;
        },
        addProduct: function(name, price){
             let id;

             if(data.products.length > 0){
                id = data.products.length + 1;
             }else{
                id = 1;
             };

             let newProduct = new Product(id, name, parseFloat(price));
             data.products.push(newProduct);

             return newProduct;
        },
        getTotal: function(){
            let total = 0;

            data.products.forEach(item => {
                total += item.price;
            });

            data.totalPrice = total;
            
            return data.totalPrice;
        },
        getProductById: function(id){
            let product = data.products.filter(item => {
                return item.id == id;
            });

            return product;
        },
        setCurrentProduct: function(product){
            data.selectedProduct = product;
        },
        getCurrentProduct: function(){
            return data.selectedProduct[0];
        },
        updateProduct: function(name, price){
            let product = null;

            data.products.forEach(item => {
                if(item.id == data.selectedProduct[0].id){
                    item.name = name;
                    item.price = parseFloat(price);
                    product = item;
                };
            });

            return product;
        },
        deleteProduct: function(selectedProduct){
            data.products.forEach((item, index) => {
                if(item.id == selectedProduct   .id){
                    data.products.splice(index, 1);
                };
            })
        }
    };
    
})();

// UI Controller
const UIController = (function(){
    const Selectors = {
        addButton: ".add-btn",
        cancelButton: ".cancel-btn",
        deleteButton: ".delete-btn",
        productList: "#item-list",
        productCard: "#product-card",
        productName: "#product-name",
        productPrice: " #product-price",
        productListItem: "#item-list tr",
        totalTl: "#total-tl",
        totalUsd: "#total-usd",
        updateButton: ".update-btn"
    };

    return{
        createProductList: function(products){
            let html = '';

            products.forEach(item => { 
                html += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.price} $</td>
                        <td class="text-end">
                            <i class="far fa-edit edit-target"></i>
                        </td>
                    </tr>
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function(){
            return Selectors;
        },
        addProduct: function(newProduct){
            document.querySelector(Selectors.productCard).style.display = "block"
            let item = `
                <tr>
                    <td>${newProduct.id}</td>
                    <td>${newProduct.name}</td>
                    <td>${newProduct.price} $</td>
                    <td class="text-end">
                        <i class="far fa-edit edit-target"></i>
                    </td>
                </tr>
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        clearInputs: function(){
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        hideCard: function(){
            document.querySelector(Selectors.productCard).style.display = "none";
        },
        showTotal: function(total){
           document.querySelector(Selectors.totalUsd).textContent = total + ' $';
           document.querySelector(Selectors.totalTl).textContent = total*18 + ' TL';
        },
        addProductToForm: function(){
            let selectedProduct = ProductController.getCurrentProduct();

            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState: function(item){
            UIController.clearInputs();
            UIController.clearWarnings(item);

            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'none';

        },
        editState: function(tr){  
            tr.classList.add("bg-warning");

            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
        },
        updateUI: function(product){
            let updatedITem = null;

            let items = document.querySelectorAll(Selectors.productListItem);
            items.forEach(item => {
                if(item.classList.contains("bg-warning")){
                    item.children[1].textContent = product.name;
                    item.children[2].textContent = product.price + " $";

                    updatedITem = item;

                    this.addingState();
                    this.clearWarnings();
                }
            });

            return updatedITem;
        },
        clearWarnings: function(){
            let items = document.querySelectorAll(Selectors.productListItem);

            items.forEach(item => {
                if(item.classList.contains("bg-warning")){
                    item.classList.remove("bg-warning");
                };
            });
        },
        deleteProductToUI: function(){
             let items = document.querySelectorAll(Selectors.productListItem);

             items.forEach(item => {
                if(item.classList.contains("bg-warning")){
                    item.remove();
                };
             });
        }
        
    };
})();

//App Controller
const AppController = (function(ProductCntrl, UIContrl, StorageCntrl){
    let UISelectors = UIContrl.getSelectors();

    // Load Event Listeners
    let loadEventListeners = function(){
        // add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);

        // edit product click
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);

        // edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener("click", editProductSubmit);

        // cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelUpdate);

        //delete button click
        document.querySelector(UISelectors.deleteButton).addEventListener("click", deleteProductSubmit);
    };

    let productAddSubmit = function(e){
        let productName = document.querySelector(UISelectors.productName).value;
        let productPrice = document.querySelector(UISelectors.productPrice).value;

        if(!productName == '' && !productPrice == '') {
            // Add Product
            const newProduct =  ProductCntrl.addProduct(productName, productPrice)

            // add item to list
            UIContrl.addProduct(newProduct);

            // add product to localstorage
            StorageCntrl.storeProduct(newProduct);
            
            // get total
            let total = ProductCntrl.getTotal();

            // show total
            UIContrl.showTotal(total);

            // Clear inputs
            UIContrl.clearInputs();
        };

        e.preventDefault();
    };

    let productEditClick = function(e){    
        if(e.target.classList.contains("edit-target")){
            let id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        
            // get selected product
            let product = ProductCntrl.getProductById(id);
            
            //set current product
            ProductCntrl.setCurrentProduct(product);

            UIContrl.clearWarnings();

            //add product to UI
            UIContrl.addProductToForm();
            UIContrl.editState(e.target.parentNode.parentNode);
        };

        e.preventDefault();
    };

    let editProductSubmit = function(e){
        let productName = document.querySelector(UISelectors.productName).value;
        let productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== "" || productPrice !== ""){
            //update product
            let updatedProduct = ProductCntrl.updateProduct(productName, productPrice);

            //update ui
            let item = UIContrl.updateUI(updatedProduct);

            // get total
            let total = ProductCntrl.getTotal();
            
            // show total
            UIContrl.showTotal(total);

            //update storage
            StorageCntrl.updateProduct(updatedProduct);
            UIContrl.addingState();
        }

        e.preventDefault();
    };

    let cancelUpdate = function(e){
        UIContrl.addingState();
        UIContrl.clearWarnings();

        e.preventDefault();
    };

    let deleteProductSubmit = function(e){
        //get selected product
        let selectedProduct = ProductCntrl.getCurrentProduct();

        //delete product

        ProductCntrl.deleteProduct(selectedProduct);

        //delete ui
        UIContrl.deleteProductToUI();

        // get total
        let total = ProductCntrl.getTotal();
            
        // show total
        UIContrl.showTotal(total);

        //delete from storage
        StorageCntrl.deleteProduct(selectedProduct.id);

        UIContrl.addingState();

        if(total == 0){
            UIContrl.hideCard();
        }

        e.preventDefault();
    };

    return{
        init: function(){
            let products = ProductCntrl.getProducts();

            UIContrl.addingState();
            UIContrl.createProductList(products);

            // get total
            let total = ProductCntrl.getTotal();

            // show total
            UIContrl.showTotal(total);

            if(products.length > 0){
                UIContrl.createProductList(products);
            }else{
                UIContrl.hideCard();
            };

            // Load Event Listeners
            loadEventListeners();
        }
    };

})(ProductController, UIController, StorageController);

AppController.init();