var mysql = require("mysql");
var inquirer = require("Inquirer");
var table = require('console.table');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
	password: "Midwestgirl@#!",
	database: "bamazon_db"
});

var updateQTY = function(id, qty){
	var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{ stock_quantity: qty },{ id: id }], function(err, res) {
    });
};

var updateSales = function(id, qty, price, sales){
	var newSales = sales + qty * price;
	var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{ product_sales: newSales },{ id: id }], function(err, res) {
    });
};

var purchaseChoices = function(){
	connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, result, fields) {
    if (err) throw err;
    var values = [];
    for (var i = 0; i < result.length; i++) {
    	values.push(
		  {
		    ID: result[i].id,
		    Name: result[i].product_name,
		    Price: "$" + result[i].price,
		    Available: result[i].stock_quantity
		  }
		);
    }
    console.table(values);
    orderFill();
	});
};

var again = function(){
	inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Purchase more awesome products?",
      choices: ["Yes", "No"]
    })
    .then(function(answer) {
    	switch (answer.action) {
	        case "Yes":
	          purchaseChoices();;
	          break;

	        case "No":
	          console.log("\n----------------------------------------");
	          console.log("Thank you for shopping with us!");
	          console.log("----------------------------------------\n");
	          connection.end();
	          break;
      	}
    });
};

var orderFill = function() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Enter ID of product you wish to purchase: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "qty",
        type: "input",
        message: "Enter the quantity you wish to purchase: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
    	var query = "SELECT stock_quantity, price, product_name, product_sales FROM products WHERE ?";
    	connection.query(query, { id: answer.id }, function(err, res) {
        if (res[0].stock_quantity >= answer.qty)
        {
        	res[0].stock_quantity = res[0].stock_quantity - answer.qty;
        	updateQTY(answer.id, res[0].stock_quantity);
        	updateSales(answer.id, answer.qty, res[0].price, res[0].product_sales);
        	console.log("\nYour Order");
        	console.log("----------------------------------------\n");
        	console.table([
        		{
				    QTY: answer.qty,
				    Name: res[0].product_name,
				    Price: "$" + res[0].price,
				    Total: "$" + answer.qty * res[0].price
				  }
        		]);
        	console.log("----------------------------------------");
        	again();
        } else {
    		console.log("\n----------------------------------------");
        	console.log("Sorry, insufficient quantity on hand!");
        	console.log("----------------------------------------\n");
        	again();
        }
      });
    });
};

purchaseChoices();
