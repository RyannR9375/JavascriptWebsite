// This version of the cart-functions uses parallel arrays, minimizes use of objects


var productNames = ["Fan", "Paper", "Soap", "Loaf" ];
var productDescriptions = ["Generic fan", "Generic paper", "Generic soap", "Luncheon loaf"];
var productPrices = [5.00, 3.50, 2.00, 3.00];
var productIds = ["q1", "q2", "q3", "q4"];

const TAXRATE = 0.085; // USE THIS IN TAX CALCULATIONS


function updateCartTotalQ()
{   //   ----------------
    //  Get the current cart quantities from local/session storage
    //  Display the total # of items currently in the cart
    //  Display this info in the cart summary div area on the page
    
	var qTot = 0;
	var q;
	for(var i=0; i<=3; i++)
	{
		q=parseInt(localStorage.getItem(productIds[i]));
		if(isNaN(q)){ q=0; }
		qTot += q;
	}
	
    // ===================================================================
    // YOU WRITE CODE TO DISPLAY THE CART's TOTAL ITEMS ON THE PAGE BELOW!
    // ===================================================================
}


function add2Cart(product)
{	//   -----------------
    //  Given the "id" of the product (such as "q1", add the desired 
    //  quantity to the existing cart quantity (if any) in storage 
    //  and redisplay the cart summary info on the page. 
    //  Default to adding 1 to the cart if quantity is not specified.
    
	var quantity = parseInt(document.getElementById(product).value);
	if(isNaN(quantity)) { quantity = 1};
	if(isNaN(parseInt(localStorage.getItem(product))))
	{
		localStorage.setItem(product, quantity);
	}
	else
	{
        // =========================================================================
        // YOU WRITE CODE TO UPDATE STORAGE WITH PROPER PRODUCT CART QUANTITY BELOW!
        // =========================================================================     
        
        
	}
	updateCartTotalQ();
}


function clearCart()
{   //   -----------
    //  Set the cart's quantities to zero in storage
    //  and redisplay the cart summary info on the page.
    
	localStorage.setItem('q1', '0');	
    
    // ====================================================================
    // YOU WRITE CODE TO CLEAR THE OTHER 3 PRODUCTS' CART QUANTITIES BELOW!
    // Better yet, use a FOR LOOP to go through all 4 products instead!
    // ====================================================================

	updateCartTotalQ();
}


function showCart()
{   //   ----------
    //  Display the full contents of the cart onto the page using a table.
    //  To do so, get each product's current cart quantity from storage and
    //  if its quantity is non-zero, write a table row into page showing
    //  that product's details. Include subtotals, tax, and grand totals for cart.
    

	var cartIsEmpty = true;
	var noTaxTotal=0;
	for(var i=0; i<productIds.length; i++)   // produce a table row for each item in the cart currently
	{
		var quantity = parseInt(localStorage.getItem(productIds[i]));
		if(!isNaN(quantity) && quantity>0)
		{
			if(cartIsEmpty) 
			{
				document.write('<tr><th class="numericCol">Quantity</th><th>Description</th><th class="numericCol">Price</th><th class="numericCol">Product Total</th></tr>');
			}
			document.write('<tr><td class="numericCol">' + quantity + '</td><td>' + productDescriptions[i] + '</td><td class="numericCol">$' + productPrices[i] + '</td><td class="numericCol">$' + (quantity*productPrices[i]).toFixed(2) + '</td></tr>');
			noTaxTotal += (quantity*productPrices[i]);
			cartIsEmpty = false;
		}
	}
    
	if(cartIsEmpty)
	{
            // ==================================================================
            // YOU REPLACE THE ALERT CODE WITH DOCUMENT.WRITE AS INDICATED BELOW!
            // ==================================================================
        
        alert("The Cart is empty, but this alert should be replaced with document.write to display this in the page's table along with a link and suggestion to go to the shopping page!");
        
	}
	else
	{       
        var grandTotal;
        var tax;
        
            // ============================================================================
            // YOU CALCULATE THE TAX AND GRAND TOTAL SO IT CAN BE DISPLAYED PROPERLY BELOW!
            // ============================================================================      
        
		document.write('<tr><td style="text-align:right" colspan="3" >Subtotal: </td><td style="text-align:right">$' + noTaxTotal.toFixed(2) + '</td></tr><tr><td style="text-align:right" colspan="3" >Tax: </td><td style="text-align:right">$' + tax.toFixed(2) + '</td></tr><tr><td style="text-align:right" colspan="3" ><strong>Grand total:</strong></td><td style="text-align:right"><strong>$' + grandTotal.toFixed(2) + '</strong></td></tr>');	
	}
}
