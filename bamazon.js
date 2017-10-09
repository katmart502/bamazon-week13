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

var displayProducts = function(result, type){
	var values = [];
	for (var i = 0; i < result.length; i++) {
    	values.push(
		  {
		    ID: result[i].id,
		    Name: result[i].product_name,
		    Department: result[i].department_name,
		    Price: "$" + result[i].price,
		    Available: result[i].stock_quantity
		  }
		);
    }
    console.log("\n" + type);
    console.log("----------------------------------------");
    console.table(values);
    console.log("----------------------------------------\n");
};


var viewProducts = function(){
	connection.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    displayProducts(result, "Products Available for Sale");
    mrgOptions();
	});
};

var viewLowInventory = function(){
	var query = "SELECT * FROM products WHERE stock_quantity < 5"; //how would I do the less than using the ? after WHERE?
    connection.query(query, function(err, result) {
    	displayProducts(result, "Low Inventory Items");
    	mrgOptions();
    });
};

var updateItem = function(newQTY, id){
	var query = connection.query("UPDATE products SET ? WHERE ?",
	    [{ stock_quantity: newQTY },{ id: id }],
	    function(err, result) {
			console.log("\nItem Updated");
	    	console.log("----------------------------------------");
	    	console.table([
	    		{
				    ID: id,
				    QTY: newQTY
				  }
	    		]);
	    	console.log("----------------------------------------\n");
	    	mrgOptions();
	});
};

var addInventory = function(){
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Enter ID of product you wish to increase in inventory: ",
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
        message: "Enter the quantity to increase for this product: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
    	var initQuery = "SELECT id, stock_quantity FROM products WHERE ?";
    	connection.query(initQuery, { id: answer.id }, function (err, result, fields) {
    		var newQTY = result[0].stock_quantity + parseInt(answer.qty);
    		updateItem(newQTY, answer.id);
		});
    });
};


var newProducts = function() {
	var departmentsList = []
	connection.query("SELECT department_name from departments", function (err, result) {
			departmentsList = result;
    		return;
		});
  	inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "Enter NAME of product you wish to add to the system: "
      },
      {
      name: "department",
      type: "rawlist",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < departmentsList.length; i++) {
          choiceArray.push(departmentsList[i].department_name);
        }
        return choiceArray;
      },
      message: "Select the DEPARTMENT this product is associated with?"
      },
      {
        name: "price",
        type: "input",
        message: "Enter PRICE of this product: ",
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
        message: "Enter the QUANTITY on hand for this product: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
	  var query = connection.query("INSERT INTO products SET ?",
	    {
	      product_name: answer.product,
	      department_name: answer.department,
	      price: answer.price,
	      stock_quantity: answer.qty
	    },
	    function(err, res) {
	    	console.log("\nItem Added");
	    	console.log("----------------------------------------");
	    	console.table([
	    		{
				    Name: answer.product,
				    Department: answer.department,
				    Price: "$" + answer.price,
				    Available: answer.qty
				}
    		]);
	    	console.log("----------------------------------------\n");
	    	mrgOptions();
	    }
	  );
	});
};

var exit = function(){
	console.log("\n----------------------------------------");
	console.log("Run the company like it was your money!");
	console.log("----------------------------------------\n");
	connection.end();
};

var mrgOptions = function() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Products",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Products":
          newProducts();
          break;

        case "Exit":
          exit();
          break;
      }
    });
};

mrgOptions();
