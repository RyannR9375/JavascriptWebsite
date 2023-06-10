var PRODUCTS = [];
var CART = [];
var prodInCart = [];
var readableCart = [];
var elementCounts = [];

var GLOBAL_RECEIPT = "";

let isDisplayed = false;
let total = 0;
let q_charity = false;

class Product {
    constructor(name, price, image, productDesc) {
        this.name = name;
        this.price = price;
        this.image = image;
		this.productDesc = productDesc;

		this.discount = 0;
        this.prodAmtForDiscount = 10;
        PRODUCTS.push(this); //IMMEDIATELY PUSHES NEW PRODUCTS INTO THE ARRAY
    }

    setDiscount(qty) {
        let discnt = 0;
        let discntInc = 5;
        let maxDiscnt = 40;

        for (let i = 1; i <= qty; i++) {
            i % this.prodAmtForDiscount == 0 ?
                discnt += discntInc : discnt;

            //IF IT HITS THE MAX DISCOUNT, RETURN EARLY SO THAT THE LOOP DOESN'T GO ON FOREVER'
            if (discnt >= maxDiscnt) {
                this.discount = discnt;
                return;
            }
        }

        this.discount = discnt;
    }

    getDiscount(qty) {
        let discnt = 0;
        let discntInc = 5;
        let maxDiscnt = 40;

        for (let i = 1; i <= qty; i++) {
            i % this.prodAmtForDiscount == 0 ?
                discnt += discntInc : discnt;

            //IF IT HITS THE MAX DISCOUNT, RETURN EARLY SO THAT THE LOOP DOESN'T GO ON FOREVER'
            if (discnt >= maxDiscnt) {
                return discnt;
            }
        }

        return discnt;
    }
}

//ALL PRODUCTS
const GOLDEN_NEON_SIGN = new Product('Golden Neon Sign', 59.99,  'Product1.png', "Beautifully hued Golden Neon Sign");
const PURPLE_NEON_SIGN = new Product('Purple Neon Sign', 109.99, 'Product2.png', "Beautifully hued Purple Neon Sign");
const GREEN_NEON_SIGN  = new Product('Green Neon Sign',  89.99,  'Product3.png', "Beautifully hued Green Neon Sign");
const ROSE_NEON_SIGN   = new Product('Rose Neon Sign',   129.99, 'Product4.png', "Pink Rose Shaped Neon Sign");

const TAX = 0.08; //TAX

function validate(products = PRODUCTS) {
    let txtErrors = []; //ERROR MESSAGE ARRAY
    //txtErrors[0]  = 'Invalid input at:'; //ERROR MESSAGE
    txtErrors[1] = ''; //START THESE AS EMPTY STRINGS SO I CAN CONCANTONATE
    txtErrors[2] = ''; //START THESE AS EMPTY STRINGS SO I CAN CONCANTONATE
    let txtErrorStr = 'REQUIRED*'; //SIMPLE ERROR MESSAGE
    let txtDefaultColor = "black";
    let txtErrorColor = "red";

    let txtPleaseFix = 'Please enter a valid input for: '; //PROMPT MESSAGE TO TELL USER TO FIX VALUE

    let minVal = 0; //MINIMUM NUMBER OF PRODUCTS
    let maxVal = 1000; //MAXIMUM NUMBER OF PRODUCTS

    let goodToPrint = true; //ERROR CHECK BOOLEAN

    if (!validateAccNum()) {
        document.getElementById('receipt').innerHTML = '';
    }

    return goodToPrint;
}

function gotoThankYou(){
    location.href = 'thankyou.html';
}

function printReceipt() {
    document.getElementById('receipt').innerHTML = '';

    let productTotal; // PRODUCT TOTAL BASED ON QUANTITIES
    let subtotal = 0; // SUBTOTAL FOR ORDER
    let taxAmt = 0;   // AMOUNT OF TAX IN DOLLARS
    let total = 0;    // GRAND TOTAL

    let spacing = 7;  // SPACING FOR RECEIPT
    let spacingChar = '.'; //SPACING FILL

    //ORDER DETAILS
    //let order = '<h2><b>' + 'Thank you, ' + user + ', for your order of...' + '</b></h2>'; //ORDER MESSAGE
    let receipt = '<h1>RECEIPT</h1><p>' ; //ENTIRE RECEIPT

    let taxAmtTxt = '<p><b>' + 'Tax ' + '$'.padStart(spacing, spacingChar); //TAX AMOUNT IN RECEIPT
    let subtotalTxt = 'Subtotal ' + '$'.padStart(spacing, spacingChar); //SUBTOTAL IN RECEIPT
    let shippingTxt = 'Shipping ' + '$'.padStart(spacing, spacingChar); //SHIPPING AMOUNT IN RECEIPT
    let totalTxt = 'Grand Total ' + '$'.padStart(spacing, spacingChar); //GRAND TOTAL IN RECEIPT

    let orderSuccess = '<p><br> Order successfully processed on ' + todaysDate() + ' using ' + getPaymentMethod() + '</p>';

    let thankYou = '<h3>' + 'Thank you for shopping at VISOR: The GO-TO Neon Sign Store.' + '</h3>'; //THANK YOU MESSAGE

    cart = JSON.parse(localStorage.getItem("cart"));

    for(let x = 0; x < cart.length; x++){
        let temp = JSON.parse(cart[x]);
        readableCart.push(temp.name);
    }

    elementCounts = readableCart.reduce((count, item) => (count[item] = count[item] + 1 || 1, count), {});
    let prodInReceipt = [];
    for(i = 0; i < cart.length; i++)   // produce a table row for each item in the cart currently
	{
        prodTotal = 0;

        cartSlot = JSON.parse(cart[i]);
        
        prodName = cartSlot.name;
        objName = JSON.stringify(cartSlot);
        objName = objName.replaceAll(String.fromCharCode(92),'');

        for(var name in elementCounts){
            let tempVal  = elementCounts[name];
            let tempName = name;
    
            elementCounts[name] = tempVal;
            name = prodName;
            elementCounts[tempName] = tempVal;
        }

        let discAmt = 0;
        let quantity = elementCounts[prodName];

        //MAKE-SHIFT INLINE FUNCTION FOR SETTING DISCOUNT SINCE JSON.parse REMOVES INITIAL CLASS FUNCTIONS AND CONSTRUCTORS
        for(let k = 1; k <= quantity; k++){
            if(k % cartSlot.prodAmtForDiscount == 0){
                discAmt += 5;
            }
        }

        //ONLY WRITE THE RECEIPT DETAILS FOR SAID ITEM ONCE
        if(!prodInReceipt.includes(prodName)){
        receipt += '<p>' + quantity + ' ' +
                prodName + '...$' + cartSlot.price + 'ea.' + 
                '.....$' + (quantity * discountProduct(cartSlot.price, discAmt)).toFixed(2) + '</p>';
        }
        subtotal  += discountProduct(cartSlot.price, discAmt);
        taxAmt = TAX * subtotal;
        
        prodInReceipt.push(prodName);
	    }
    grandTotal = subtotal + taxAmt;

    //FIND SHIPPING OPTION SELECTED
    var radios = document.getElementsByName("shippingDetails");
    for (var radio of radios) {
        if (radio.checked) {
            shippingTxt += radio.value;
            subtotal += parseInt(radio.value);
        }
    }

    //ADD TOTALS
    total = calculateTotal(subtotal, TAX); //CALCULATE TOTAL
    taxAmt = calculateTax(subtotal, TAX); //CALCULATE TAX IN DOLLARS

    //CHARITY
    storeTotal(total);

    //ADD STRINGS
    taxAmtTxt += taxAmt.toFixed(2) + '<br>';
    subtotalTxt += subtotal.toFixed(2) + '<br>';
    shippingTxt += '.00' + '<br>';
    totalTxt += total.toFixed(2) + '<br>';

    //BUILD THE RECIEPT STRING
    receipt +=
        taxAmtTxt +
        subtotalTxt +
        shippingTxt +
        totalTxt +
        '</b></p>';
    //PRINT THE RECEIPT STRING
    localStorage.setItem("globalReceipt", receipt);
    gotoThankYou();
    localStorage.setItem("cart", {});
}

function printGlobalReceipt(){
    var tempString = localStorage.getItem("globalReceipt");
    document.write(tempString);
}

function showDiscounts(toShow) {
    if (toShow == false) {
        document.getElementById('discounts').style.display = "block"; //SETS THE DIV'S DISPLAY TO 'block' INSTEAD OF 'none' SO IT SHOWS UP
        document.getElementById('btnDiscount').value = 'Hide Discounts'; //SETS THE BUTTONS TEXT TO 'Show Discounts'
    }
    else {
        document.getElementById('discounts').style.display = "none"; //SETS THE DIV'S DISPLAY TO 'none' INSTEAD OF 'block' SO IT HIDES
        document.getElementById('btnDiscount').value = 'Display Discounts';//SETS THE BUTTONS TEXT TO 'Hide Discounts'
    }
}

function calculateTotal(subtotal, tax) {
    return (subtotal * (1 + tax));
}

function calculateTax(subtotal, tax) {
    return (subtotal * tax);
}

function inRange(value, min, max) {
    let val = parseInt(value);
    return (val >= min && val <= max);
}

function discountProduct(productPrice, discount) {
    discount = discount / 100;
    return productPrice * (1 - discount);
}

function createDiscountDIV(product) {
    discountAmts = [10, 20, 30, 40, 50];

    document.write(
        "<tbody> <table border = '1'" +
        "cellspacing = '0'" +
        "cellpadding = '6'" +
        "summary = 'Table of product discounts'" +
        "id = 'DiscountTable'>" +
        "<caption><h3><u>PRODUCT DISCOUNTS</u></h3></caption>" +
        "<tr>" +
        "<td><p><b> QUANTITY </p></b></td>" +
        "<td><p><b> ORIGINAL PRICE </p></b></td>" +
        "<td><p><b> DISCOUNT % </p></b></td>" +
        "<td><p><b> DISCOUNT PRICE </td></p></b>" +
        "<tbody>"
    );

    for (let i = 0; i < discountAmts.length; i++) {
        document.write(
            '<tr><td>' + discountAmts[i] + //QUANTITY OF PRODUCTS NEEDED FOR A DISCOUNT
            '</td><td>' + '$' + (product.price * discountAmts[i]) + //PRICE OF TOTAL WITHOUT DISCOUNTS
            '</td><td>' + product.getDiscount(discountAmts[i]) + '%' + //DISCOUNT %
            '</td><td>' + '$' + (discountProduct(product.price, product.getDiscount(discountAmts[i])) * discountAmts[i]).toFixed(2) +
            '</td></tr>'
        );
    }
    document.write('</table>');
}

function createProductEntries(){
	document.write(
		'<table cellspacing="0" cellpadding="6" class = "productTable">'
	);

	for(let i = 0; i < PRODUCTS.length; i++){
		document.write(
			'<tbody>' +
			'<tr>' +
			'<td><img src="' + PRODUCTS[i].image + '"width="100" height="100" alt="' + PRODUCTS[i].name + '" class ="productImgs"/></td>' +
			'<td><p>' + PRODUCTS[i].name + '</p>' +
			'<a>' + PRODUCTS[i].productDesc + '<br></a></td>' +
			'<td><a>Price:<br>$' + PRODUCTS[i].price + '</td></a>' +
			'<td>' +
			'<label for="q'+i + '"><a>Quantity:<br></label></a>' +
			'<input type="number" min="0" name="q'+i + '" id="q'+i +'" class="quantity" value="1"></td>' +
			'<td><img src="addToCart.png" width="36" height="36" alt="add to cart button" id = "cartAdd' + i + '" class = "cartAdd"/></td>' +
			'</tr>' +
			'<tr>'
		);

        document.getElementById('cartAdd' + i).onclick = function (){
            addToCart(PRODUCTS[i], i);
        }
	}

	document.write(
		'<td colspan="5" align="right"><form><input type="button" value="Proceed to Cart" onclick="goToCart();">&nbsp; &nbsp; &nbsp;<br> <br>' +
    	'<input type="button" value="Empty the Cart" onclick="clearCart();">&nbsp; &nbsp; &nbsp;</form>' +
      	'</td>' +
      	'</tr>' +
  		'</tbody>' +
		'</table>'
	)
}

function printArray(arr){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] instanceof Array){
            printArray(arr[i]);
        }else{
            console.log(arr[i]);
        }
    }
}

function clearCart(){
    CART = [];
    localStorage.setItem("cart", {});
    console.log("CLEARED CART");
}

function goToCart(){
    location.href = "cart.html";
}

function createCart(){
    if(!localStorage.getItem("cart"))
        localStorage.setItem("cart", {});
}

function gotoShop(){
    location.href = 'shop.html';
}

function showCart()
{
	var cartIsEmpty = true;
	var noTaxTotal = 0;
    var cart = JSON.parse(localStorage.getItem("cart"));

    if(cart.length <= 0 || cart == {}){
        document.write(
            '<h1> Your cart is currently empty! </h1>' +
            '<img src = "shopNow.png" id="shopPic" onclick="gotoShop()">'
        );
    }else{
    //console.log("SIZE OF CART: " + cart.length);
    //console.log(typeof cart);

    //CHECKING IF THE CART HAS AN ITEM THAT HAS MORE THAN '1' AS IT'S QUANTITY
    var hasDupsSimple = function(array) {

        return array.some(function(value) {                            
           return array.indexOf(value) !== array.lastIndexOf(value);   
        })
    }

    for(let x = 0; x < cart.length; x++){
        let temp = JSON.parse(cart[x]);
        readableCart.push(temp.name);
    }

    elementCounts = readableCart.reduce((count, item) => (count[item] = count[item] + 1 || 1, count), {});

    /*for(var name in elementCounts){
        console.log("Iterating through prop with name", name, " its value is ", elementCounts[name]);
    }
    console.log(elementCounts);*/

    //console.log("HAS DUPES: " + hasDupsSimple(cart));
    
    document.write(
        '<tr><th class="numericCol">Product</th>' + //TABLE HEADER PRODUCT
        '<th class="numericCol">Quantity</th>' + //TABLE HEADER QUANTITY
        '<th class="numericCol">Description</th>' + //TABLE HEADER DESCRIPTION
        '<th class="numericCol">Price</th>' + //TABLE HEADER PRICE
        '<th class="numericCol">Product Total</th>' + //TABLE HEADER PRODUCT TOTAL
        '<th class="delList"> </th>' + //TABLE HEADER PRODUCT TOTAL
        '</tr>'
        );

    let subtotal = 0;
    let tax = 0;
    let grandTotal = 0;
    let prodTotal = 0;

    let cartSlot;
    let prodName;
    let objName;
    let i = 0;
    let counter = -1;

	for(i = 0; i < cart.length; i++)   // produce a table row for each item in the cart currently
	{
        prodTotal = 0;

        cartSlot = JSON.parse(cart[i]);
        
        prodName = cartSlot.name;
        objName = JSON.stringify(cartSlot);
        objName = objName.replaceAll(String.fromCharCode(92),'');

        for(var name in elementCounts){
            let tempVal  = elementCounts[name];
            let tempName = name;
    
            elementCounts[name] = tempVal;
            name = prodName;
            elementCounts[tempName] = tempVal;
        }
    
        /*for(var name in elementCounts){
            console.log("Iterating through prop with name", name, " its value is ", elementCounts[name]);
        }*/

        let discAmt = 0;
        let quantity = elementCounts[prodName];

        //MAKE-SHIFT INLINE FUNCTION FOR SETTING DISCOUNT SINCE JSON.parse REMOVES INITIAL CLASS FUNCTIONS AND CONSTRUCTORS
        for(let k = 1; k <= quantity; k++){
            if(k % cartSlot.prodAmtForDiscount == 0){
                discAmt += 5;
            }
        }

        let txtDiscApplied = 
            discAmt == 0 ?
                "" : '<a>Discount of ' + discAmt + '% applied!</a>';

        if(!prodInCart.includes(prodName)){
		    document.write(
                '<tr>' + 
                '<td class="numericCol">' + '<img src ="' + cartSlot.image + '"  >' + //IMAGE
                '</td><td class="numericCol"> <p> '  + quantity + //PRODUCT QUANTITY
                '</td><td class="numericCol"> <p> '  + cartSlot.productDesc + //PRODUCT DESC
                '</td><td class="numericCol"> <p> $' + cartSlot.price + //PRODUCT PRICE
                '</td><td class="numericCol"> <p> $' + (quantity * discountProduct(cartSlot.price, discAmt)).toFixed(2) + '<br><br>' + txtDiscApplied + //PRODUCT TOTAL
                '</td><td class="xArea"> <img src = "del_item.png" id="xBtn' + prodName + '">' +
                '</td></tr>'
            );

            document.getElementById("xBtn" + prodName).addEventListener('click', function(){
                //stringToPass = stringToPass.substring(1, stringToPass.length -1);
                //stringToPass = stringToPass.replaceAll(String.fromCharCode(92),'');
                delItemCart(objName);
            });
        }
        prodInCart.push(prodName);
		
        subtotal  += discountProduct(cartSlot.price, discAmt);
        tax = TAX * subtotal;
	}
    grandTotal = subtotal + tax;

    /*console.log("FINISHED ELEMENT COUNTS: ");
    console.log(elementCounts);
    console.log("PRODUCTS IN CART: ");
    console.log(prodInCart);*/
	    document.write(
            //SUBTOTAL
            '<tr><td style="text-align:right" colspan="3" > <p>' +
            'Subtotal: </td><td style="text-align:right"> <p> $' + subtotal.toFixed(2) + 

            //TAX
            '</td></tr><tr><td style="text-align:right" colspan="3" > <p>' + 
            'Tax: </td><td style="text-align:right"><p> $' + tax.toFixed(2) + 
            
            //GRAND TOTAL
            '</td></tr><tr><td style="text-align:right" colspan="3" > <p>' +
            '<strong>Grand total:</strong></td><td style="text-align:right"><strong><p> $' + grandTotal.toFixed(2) +
            
            '</table>'
            );	

            document.write(
                '</strong></td><td><img src = "purchase.png" class = "smallPic" id = "purchaseBtn"></td></tr>'
            );
            document.getElementById("purchaseBtn").onclick = function (){
                location.href = "checkout.html";
            }
	//}
    }
}

function addToCart(product, i){
    for(let j = 0; j < document.getElementById("q" + i).value; j++){
        CART.push(JSON.stringify(product));
    }

    /*if(localStorage.getItem("cart") != null){
        CART = CART.concat(localStorage.getItem("cart"));
    }*/

    console.log('CART CONTENTS:');
    console.log(CART);
    //console.log(JSON.parse(localStorage.getItem("cart")).length);
    var data = []
    let localCart = localStorage.getItem("cart");

    //BUG BC EVERYTHING IN LOCAL CART ALREADY CONTAINS THE STUFF IN CART, THAT Y THE BUG HAPPENS ONLY IF U STAY ON THE SAME PAGE
    try{
        localCart = JSON.parse(localCart);

        console.log("LOCAL CART:");
        console.log(JSON.parse(localCart));
    }catch(err){
        localCart = localCart;

        console.log("LOCAL CART:");
        console.log(localCart);
    }

    if(typeof localCart === "object"){
        data = CART.concat(localCart);
        //console.log("IS OBJECT");
    }else{
        data = CART;
        //console.log("IS NOT OBJECT");
    }

    localStorage.setItem("cart", JSON.stringify(data));
}

function delItemCart(product){
    let debug = [];
    var cart = JSON.parse(localStorage.getItem("cart"));

    console.log("WHAT ARE WE LOOKING FOR ?" + product);
    //console.log("IS CART AN ARRAY? " + Array.isArray(cart));
    //console.log("WHAT ARRAY ARE WE TESTING IT AGAINST?" + cart);
    //console.log("DOES THE ARRAY CONTAIN WHAT WE'RE LOOKING FOR ?" + cart.includes(product));



    if(cart.includes(product)){
        debug = cart.splice(cart.indexOf(product), 1);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    console.log("WHAT JUST GOT DELETED:" + debug);
}

function todaysDate() {
    var datToday = new Date(); //CREATE NEW DATE OBJECT

    //IF THE DATE IS LESS THAN TWO DIGITS LARGE, ADD A 0.
    let txtMonth =
        datToday.getMonth() < 10 ?
            '0' + (1 + datToday.getMonth()) : datToday.getMonth();

    let txtDay =
        datToday.getDate() < 10 ?
            '0' + datToday.getDate() : datToday.getDate();


    var dateTxt = txtMonth + "/" + txtDay + "/" + datToday.getFullYear();
    return dateTxt;
}

function getPaymentMethod() {
    let dropdown = document.getElementById('paymentMethods');

    //FIND THE SELECTED INDEX
    let selectedIndex = dropdown.selectedIndex;

    //FIND THE TEXT OF THE SELECTED INDEX
    let selectedValue = dropdown.options[selectedIndex].text;

    return selectedValue;
}

function validateAccNum() {
    document.getElementById('accountNumberError').style.color = "black";
    document.getElementById('accountNumberError').style.fontWeight = "normal";
    document.getElementById('accountNumberError').innerHTML = '';

    let accNum = document.getElementById('accNumber').value.toLowerCase();
    accNumCorrectLength = 7;

    //PATTERN
    let pattern = /^[a-z]{2}\-\d{4}$/;

    if (pattern.test(accNum))
        return true;
    else {
        document.getElementById('receipt').innerHTML = '';
        document.getElementById('accountNumberError').style.color = "red";
        document.getElementById('accountNumberError').style.fontWeight = "bold";
        document.getElementById('accountNumberError').innerHTML = 'Please enter a valid account number and try again.';
    }
}

function isValidPhoneNo() { 
    document.getElementById('phoneNumberDIV_error').innerHTML = '';
    let num = document.getElementById('phoneNumber').value;

    let pattern = /^\d{3}\-\d{3}\-\d{4}$/;

    if (pattern.test(num)) {
        return true;
    }
    else {
        document.getElementById('receipt').innerHTML = '';
        document.getElementById('phoneNumberDIV_error').style.color = "red";
        document.getElementById('phoneNumberDIV_error').style.fontWeight = "bold";
        document.getElementById('phoneNumberDIV_error').innerHTML = 'Please enter a valid phone number and try again.';
        return false;
    }
}

function storeTotal(num) {
    total = num;
}

function roundTotal(num) {
    num = Math.ceil(num);
    return num
}