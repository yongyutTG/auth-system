// const express = require('express')
// const app = express()
// const port = 4000
// const mysql2 = require('mysql2')
// const bcrypt = require('bcrypt')
// const cors = require('cors')



// const saltRounds = 10

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(cors())

// const conn = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password : '12345678',
//     database: 'restapi'
//   });


// app.get('/users', async (req, res) => {
//     let sql = "SELECT * FROM users"

//     await conn.execute(sql, 
//         (err, result) => {
//             if(err) {
//                 res.status(500).json({
//                     message : err.message
//                 })
//                 return
//             }
//             res.status(200).json({
//                 message : "เรียกข้อมูลสำเร็จ",
//                 data : result
//             })
//         })
// })

// app.post('/users', async (req, res) => {
//     const { email, password } = req.body
//     let role = 'member'
//     bcrypt.genSalt(saltRounds, (err, salt) => {
//         bcrypt.hash(password, salt, (err, hash) => {
//             let sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)"
//             conn.execute(sql,
//                 [email, hash, role],
//                 (err, result) => {
//                     if(err) {
//                         res.status(500).json({
//                             message : err.message
//                         })
//                         return
//                     }
//                     res.status(201).json({
//                         message : "เพิ่มข้อมูลสำเร็จ",
//                         data : result
//                     })
//                 })
//         })
//     })
// })

// app.get('/users/:id', async (req, res) => {
//     const { id } = req.params
//     let sql = "SELECT * FROM users WHERE id = ?"
//    await conn.execute(sql,
//         [id],
//         (err, result) => {
//             if(err) {
//                 res.status(500).json({
//                     message : err.message
//                 })
//                 return
//             }
//             res.status(200).json({
//                 message : "เรียกข้อมูลสำเร็จ",
//                 data : result
//             })
//         })
// })

// app.put('/users/:id', async (req, res) => {
//     const { id } = req.params
//     const { email, password } = req.body
//   await  bcrypt.genSalt(saltRounds, async (err, salt) => {
//       await  bcrypt.hash(password, salt, async (err, hash) => {
//             let sql = "UPDATE users SET email = ? ,password = ? WHERE id = ?"
//          await   conn.execute(sql,
//                 [email, hash, id],
//                 (err, result) => {
//                     if(err) {
//                         res.status(500).json({
//                             message : err.message
//                         })
//                         return
//                     }
//                     res.status(201).json({
//                         message : "แก้ไขข้อมูลสำเร็จ",
//                         data : result,
//                     })
                    
//                     console.log( "email:",email,"แก้ไขข้อมูลสำเร็จ")
//                 })
//         })
//     })

// })

// app.delete('/users/:id', async (req, res) => {
//     const { id } = req.params
//     let sql = "DELETE FROM users WHERE id = ?"

//     await conn.execute(sql,
//         [id],
//         (err, result) => {
//             if(err) {
//                 res.status(500).json({
//                     message : err.message
//                 })
//                 return
//             }
//             res.status(200).json({
//                 message : "ลบข้อมูลสำเร็จ",
//                 data : result
//             })
//         })
// })

// app.listen(port, () => {
//   console.log(`Server listening on ${port}`)
// })const express = require('express')
// const app = express()
// const port = 4000
// const mysql2 = require('mysql2')
// const bcrypt = require('bcrypt')
// const cors = require('cors')



// const saltRounds = 10

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(cors())

// const conn = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password : '12345678',
//     database: 'restapi'
//   });


// app.get('/users', async (req, res) => {
//     let sql = "SELECT * FROM users"

//     await conn.execute(sql, 
//         (err, result) => {
//             if(err) {
//                 res.status(500).json({
//                     message : err.message
//                 })
//                 return
//             }
//             res.status(200).json({
//                 message : "เรียกข้อมูลสำเร็จ",
//                 data : result
//             })
//         })
// })

// app.post('/users', async (req, res) => {
//     const { email, password } = req.body
//     let role = 'member'
//     bcrypt.genSalt(saltRounds, (err, salt) => {
//         bcrypt.hash(password, salt, (err, hash) => {
//             let sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)"
//             conn.execute(sql,
//                 [email, hash, role],
//                 (err, result) => {
//                     if(err) {
//                         res.status(500).json({
//                             message : err.message
//                         })
//                         return
//                     }
//                     res.status(201).json({
//                         message : "เพิ่มข้อมูลสำเร็จ",
//                         data : result
//                     })
//                 })
//         })
//     })
// })

// app.get('/users/:id', async (req, res) => {
//     const { id } = req.params
//     let sql = "SELECT * FROM users WHERE id = ?"
//    await conn.execute(sql,
//         [id],
//         (err, result) => {
//             if(err) {
//                 res.status(500).json({
//                     message : err.message
//                 })
//                 return
//             }
//             res.status(200).json({
//                 message : "เรียกข้อมูลสำเร็จ",
//                 data : result
//             })
//         })
// })

// app.put('/users/:id', async (req, res) => {
//     const { id } = req.params
//     const { email, password } = req.body
//   await  bcrypt.genSalt(saltRounds, async (err, salt) => {
//       await  bcrypt.hash(password, salt, async (err, hash) => {
//             let sql = "UPDATE users SET email = ? ,password = ? WHERE id = ?"
//          await   conn.execute(sql,
//                 [email, hash, id],
//                 (err, result) => {
//                     if(err) {
//                         res.status(500).json({
//                             message : err.message
//                         })
//                         return
//                     }
//                     res.status(201).json({
//                         message : "แก้ไขข้อมูลสำเร็จ",
//                         data : result,
//                     })
                    
//                     console.log( "email:",email,"แก้ไขข้อมูลสำเร็จ")
//                 })
//         })
//     })

// })

// app.delete('/users/:id', async (req, res) => {
//     const { id } = req.params
//     let sql = "DELETE FROM users WHERE id = ?"

//     await conn.execute(sql,
//         [id],
//         (err, result) => {
//             if(err) {
//                 res.status(500).json({
//                     message : err.message
//                 })
//                 return
//             }
//             res.status(200).json({
//                 message : "ลบข้อมูลสำเร็จ",
//                 data : result
//             })
//         })
// })

// app.listen(port, () => {
//   console.log(`Server listening on ${port}`)
// })