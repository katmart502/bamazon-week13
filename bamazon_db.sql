DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products(
id MEDIUMINT NOT NULL AUTO_INCREMENT,
product_name CHAR(255) NOT NULL,
department_name  CHAR(255) NOT NULL,
price DOUBLE(25,2) NOT NULL,
stock_quantity INTEGER(20) NOT NULL,
product_sales DOUBLE(25,2) NULL DEFAULT 0,
PRIMARY KEY (id)
);

CREATE TABLE departments(
department_id MEDIUMINT NOT NULL AUTO_INCREMENT,
department_name CHAR(255) NOT NULL,
over_head_costs double(25,2),
PRIMARY KEY (department_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales) VALUES("Old Spice Deodorant", "Pharmacy", 4.32, 72, 4374.56),("Dell Latitude E6540", "Electronics", 2754.99, 2, 175689.24),("Bic Lighter", "General", 1.99, 777, 95482.54),("Tucks Medicated Pads", "Pharmacy", 8.78, 146, 36874.25),("Bic Disposable Razors", "Pharmacy", 5.88, 4, 5814.14),("Spanks Undergarments", "Clothing", 14.99, 172, 1459678.23),("Dove Soap", "Pharmacy", 3.99, 16, 7849.97),("Folgers Coffee", "Grocery", 9.87, 552, 22588.96),("Monster Lo Cal Blue", "Grocery", 2.32, 792, 1),("Pedron 10th Anniversary Cigars 6 x 54", "General", 7.95, 24, 650456.31);

INSERT INTO departments(department_name, over_head_costs) VALUES("Pharmacy", 3586.24),("Electronics", 56874.34),("General", 78965.45),("Clothing", 541264.87),("Grocery", 78945.68);

select * from products;
