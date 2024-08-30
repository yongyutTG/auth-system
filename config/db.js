let mysql = require('mysql2');
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydata"
})

connection.connect((error) => {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connected...');
    }
})

module.exports = connection;