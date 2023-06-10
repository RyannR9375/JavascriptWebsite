var PRODUCTS = [];

let isDisplayed = false;
let isLoggedIn  = false;
let q_charity   = false;

let total = 0;

class Product {
    constructor(name, price, image) {
        this.name = name;
        this.price = price;
        this.discount = 0;
        this.image = image;
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
const GOLDEN_NEON_SIGN = new Product('Golden Neon Sign', 59.99, 'Product1.png');
const PURPLE_NEON_SIGN = new Product('Purple Neon Sign', 109.99, 'Product2.png');

const TAX = 0.08; //TAX

function validate(products = PRODUCTS) {
    let amt = document.getElementsByClassName('txtQuantities'); //GET THE USER'S INPUT FOR EACH QUANTITY BOX
    let user = document.getElementById('txtName'); //USER'S NAME

    let txtErrors = []; //ERROR MESSAGE ARRAY
    //txtErrors[0]  = 'Invalid input at:'; //ERROR MESSAGE
    txtErrors[1] = ''; //START THESE AS EMPTY STRINGS SO I CAN CONCANTONATE
    txtErrors[2] = ''; //START THESE AS EMPTY STRINGS SO I CAN CONCANTONATE
    let txtErrorStr = 'REQUIRED*'; //SIMPLE ERROR MESSAGE
    let txtDefaultColor = "black";
    let txtErrorColor = "red";

    let txtPleaseInput = '<h2>' + 'Please input the amount of products you would like to purchase before processing an order.' + '</h2>'; //MESSAGE THAT SHOWS UP IF USER PROCESSES ORDER WITHOUT ANY QUANTITIES ABOVE 0
    let txtPleaseFix = 'Please enter a valid input for: '; //PROMPT MESSAGE TO TELL USER TO FIX VALUE

    let minVal = 0; //MINIMUM NUMBER OF PRODUCTS
    let maxVal = 1000; //MAXIMUM NUMBER OF PRODUCTS
    let minNameLength = 1; //MINIMUM NAME LENGTH
    let count = 0; //CHECK IF THERE WAS ANY INPUT IN THE TEXT BOXES AT ALL
    let value = 0; //CHECK IF THERE THE INPUT IN THE TEXT BOXES ADDED UP TO BE GREATER THAN 0

    let goodToPrint = true; //ERROR CHECK BOOLEAN

    //ERROR CHECK USERNAME
    if (user.value.length <= minNameLength) {
        txtErrors[1] = 'Username Error'; //USERNAME ERROR MESSAGE
        document.getElementById('receipt').innerHTML = txtErrors[1]; //DISPLAY ERROR MESSAGE
        goodToPrint = false;
    }

    //ERROR CHECK QUANTITIES
    for (let i = 0; i < amt.length; i++) {
        amt[i].style.color = txtDefaultColor;
        let qty = amt[i].value; //SET VARIABLE FOR THE ARRAY ELEMENT
        let isValid = inRange(amt[i].value, minVal, maxVal); //CHECK IF VALUE IS IN RANGE

        //INPUT VALIDATION
        if ((!isValid && qty.length > minVal) || isNaN(qty)) { //IF ITS NOT IN RANGE, AND IT'S NOT A NUMBER, AND THE LENGTH IS GREATER THAN 0
            txtErrors[2] = ''; //RESET THE STRING SO IT DOESN'T KEEP ADDING THE PRODUCT NAME TO THE PROMPT MESSAGE
            txtErrors[2] += products[i].name + ' Quantity'; //QUANTITY ERROR MESSAGE

            amt[i].style.color = txtErrorColor; //SET THE INPUT BOX TEXT TO RED
            qty = txtErrorStr; //SET THE QUANTITY VARIABLE TO EQUAL THE USER'S INPUTTED VALUE
            amt[i].value = txtErrorStr; //DIRECTLY SET THE USER'S INPUTTED VALUE AS THE VALUE IN THE TEXT BOX
            amt[i].select(); //SELECT THE ERROR INPUT

            goodToPrint = false; //SET THE ERROR-CHECK VARIABLE TO FALSE
        }

        count += qty.length; //VARIABLE TO CHECK IF THERE'S ANY INPUT IN THE TEXT BOXES AT ALL

        //ONLY ADD TO THE 'value' VARIABLE IF THERE'S ANYTHING IN THE TEXT BOX
        if (qty.length > 0)
            value += parseInt(amt[i].value);
    }

    if (count <= 0 || value <= minVal) {

        //IF ALL TEXT FIELDS ARE EMPTY, DISPLAY ERROR MSG
        for (let i = 0; i < amt.length; i++) {
            amt[i].style.color = txtErrorColor; //SET THE INPUT BOX TEXT TO RED
            qty = txtErrorStr; //SET THE QUANTITY VARIABLE TO EQUAL THE USER'S INPUTTED VALUE
            amt[i].value = txtErrorStr; //DIRECTLY SET THE USER'S INPUTTED VALUE AS THE VALUE IN THE TEXT BOX
            amt[0].select(); //SELECT THE ERROR INPUT
        }

        goodToPrint = false;
        document.getElementById('receipt').innerHTML = txtPleaseInput;
    }

    if (!validateAccNum()) {
        document.getElementById('receipt').innerHTML = '';
    }

    return goodToPrint;
}

function printReceipt(quantities = ids, products = PRODUCTS) {
    document.getElementById('receipt').innerHTML = '';

    let amt = document.getElementsByClassName('txtQuantities'); //GET THE USER'S INPUT FOR EACH QUANTITY BOX
    let user = document.getElementById('txtName').value.split(" ")[0]; //USER'S NAME

    let productTotal; // PRODUCT TOTAL BASED ON QUANTITIES
    let subtotal = 0; // SUBTOTAL FOR ORDER
    let taxAmt = 0;   // AMOUNT OF TAX IN DOLLARS
    let total = 0;    // GRAND TOTAL

    let spacing = 7;  // SPACING FOR RECEIPT
    let spacingChar = '.'; //SPACING FILL

    //ORDER DETAILS
    let order = '<h2><b>' + 'Thank you, ' + user + ', for your order of...' + '</b></h2>'; //ORDER MESSAGE
    let receipt = '<p><b>' + order; //ENTIRE RECEIPT

    let taxAmtTxt = '<p><b>' + 'Tax ' + '$'.padStart(spacing, spacingChar); //TAX AMOUNT IN RECEIPT
    let subtotalTxt = 'Subtotal ' + '$'.padStart(spacing, spacingChar); //SUBTOTAL IN RECEIPT
    let shippingTxt = 'Shipping ' + '$'.padStart(spacing, spacingChar); //SHIPPING AMOUNT IN RECEIPT
    let totalTxt = 'Grand Total ' + '$'.padStart(spacing, spacingChar); //GRAND TOTAL IN RECEIPT

    let orderSuccess = '<br> Order successfully processed on ' + todaysDate() + ' using ' + getPaymentMethod();

    let thankYou = '<h3>' + 'Thank you for shopping at VISOR: The GO-TO Neon Sign Store.' + '</h3>'; //THANK YOU MESSAGE

    for (let i = 0; i < amt.length; i++) {
        let qty = amt[i].value;

        //ZERO CHECK
        if (qty != 0) {
            //PLURAL OR NOT
            let productName = '';
            if (qty > 1)
                productName = products[i].name + 's';
            else
                productName = products[i].name;

            //CHECK FOR DISCOUNTS
            products[i].setDiscount(qty);
            let discApplied =
                products[i].discount == 0 ?
                    '' : ' (' + products[i].discount + '% off)';

            //OUTPUT
            productTotal = qty * discountProduct(products[i].price, products[i].discount); //PRODUCT TOTAL PRICE BASED ON QUANTITY

            receipt += qty + ' ' +
                productName + ' @ $' +
                discountProduct(products[i].price, products[i].discount).toFixed(2) +
                ' $'.padStart(spacing, spacingChar) +
                productTotal.toFixed(2) + discApplied
                + '<br>';

            subtotal += productTotal;
        }
    }
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
    document.getElementById('charity').style.display = "block";

    if (q_charity)
        total = roundTotal(total);

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
        thankYou +
        orderSuccess +
        '</b></p>';

    //PRINT THE RECEIPT STRING
    document.getElementById('receipt').innerHTML = receipt;
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

function discountProduct(product, discount) {
    discount = discount / 100;
    return product * (1 - discount);
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