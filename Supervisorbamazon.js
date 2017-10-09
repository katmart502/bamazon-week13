var mysql = require("mysql");
var inquirer = require("Inquirer");
var table = require("console.table");
var roundTo = require("round-to");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
	password: "Midwestgirl@#!",
	database: "bamazon_db"
});

var addDepartment = function(){
	inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Enter the new DEPARTMENT: ",
      },
      {
        name: "over_head",
        type: "input",
        message: "Enter the department OVER HEAD: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
    	var query = connection.query(
	    "INSERT INTO departments SET ?",
	    {
	      department_name: answer.department,
	      over_head_costs: answer.over_head,
	    },
	    function(err, result) {
	    	console.log("\nDepartment Added");
	    	console.log("----------------------------------------");
	    	console.table([
	    		{
				    Department: answer.department,
				    Over_Head: answer.over_head
				  }
	    		]);
	    	console.log("----------------------------------------\n");
	    	supervisorOptions();
	    });
    });
};

var viewSales = function(){
	var query = "SELECT departments.over_head_costs, SUM(products.product_sales) AS total_sales, departments.department_id, departments.department_name FROM departments INNER JOIN products GROUP BY departments.department_id";
  	connection.query(query, function(err, result) {
	  	if (err) { console.log(err); }
	  	var values = [];
		for (var i = 0; i < result.length; i++) {
			var total_profit = roundTo((result[i].total_sales - result[i].over_head_costs), 2);
	    	values.push(
			  {
			    Department_ID: result[i].department_id,
			    Department_Name: result[i].department_name,
			    Over_Head_Costs: "$" + result[i].over_head_costs,
			    Product_Sales: "$" + result[i].total_sales,
			    Profit: "$" + total_profit
			  }
			);
	    }
	    console.log("\nDepartment Sales Info");
	    console.log("----------------------------------------");
	    console.table(values);
	    console.log("----------------------------------------\n");
	    supervisorOptions();
	});
};

var exit = function(){
	console.log("\n----------------------------------------");
	console.log("Run the company like it was your money!");
	console.log("----------------------------------------\n");
	connection.end();
};

var supervisorOptions = function() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products Sales by Department",
        "Create New Department",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products Sales by Department":
          viewSales();
          break;

        case "Create New Department":
          addDepartment();
          break;

        case "Exit":
          exit();
          break;
      }
    });
};

supervisorOptions();
