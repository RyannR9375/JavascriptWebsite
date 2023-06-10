//PAGE STUFF
var pageList = [];

class Page{
    constructor(name, link){
        this.name = name;
        this.link = link;
        pageList.push(this);
    }
}

//ALL PAGES
const PAGE_HOME = new Page("Home", "index.html");
const PAGE_SHOP = new Page("Shop", "shop.html");
const PAGE_CART = new Page("Cart", "cart.html");
const PAGE_CHECKOUT = new Page("Checkout", "checkout.html");

function createNavBar() {
    document.write('<ul>');

    for (let i = 0; i < pageList.length; i++) {
        document.write(
            '<li> <a href=' + pageList[i].link + '>' + pageList[i].name + ' </a> </li>'
        );
    }

    document.write('</ul>');
}

function createFooter() {
    document.write(
        '<footer>' +
        '<p>' +
        'Copyright 2023 VISOR' +
        '</p>' +
        '</footer>'
    );
}

function createLogo(){
    document.write(
        '<header><img src="visor-logo.jpg" alt="VISOR Company Logo" /></header>'
    );
}

//CART STUFF
var cart;

class Cart {
    constructor(products) {
        this.products = products;
    }
}
