// const express = require("express");
// const winston = require("./loggers");
// const app = express();
// const _ = require("lodash");
// require("dotenv").config();

// const algoliasearch = require("algoliasearch");
// let client = algoliasearch(
//   process.env.ALGOLIA_APPLICATION_ID,
//   process.env.ALGOLIA_ADMIN_API_KEY
// );
// let index = client.initIndex("products");
// index.setSettings({ searchableAttributes: ["name", "category", "brand"] }); // word that can be use to search
//custom settings
// index.setSettings({ customRanking: ["desc(isFeature)", "des(rating)"] }); //while rating is a number display in descending order
// index.setSettings({ customRanking: ["asc(_id)"] }); //while rating is a number display in descending order
// let productJSON = require("./products.json");

// const { data } = require("./util/data");
// require("dotenv").config();
// require("./util/db")();
// require("./util/middleware&route")(app);
// require("./util/config")();

// app.get("/api/products", (req, res, next) => {
//   return res.status(200).json(data);
// });

// app.get("/api/products/algolia", (req, res, next) => {
//   let result = data.products; // array from db
//   result.forEach((product) => {
//     product.objectID = Number(product._id); // Make sure each object has an 'ObjectID' defined
//     index.saveObject(product); // Index the product with Algolia
//   });
//   return res.status(200).json({ message: "pushed" });
// });

// app.get("/api/products/algolia", async (req, res, next) => {
//   const actor = [
//     {
//       name: "Laravel",
//       rating: 200,
//     },
//     {
//       name: "php",
//       rating: 100,
//     },
//     {
//       name: "Node",
//       rating: 500,
//     },
//   ];
// try {
//   await index.addObjects(actor); //using array of object
//   await index.addObjects(productJSON); //using a json file
// const users = await User.findAll();//from database
// await index.addObjects(users);
// if record is much we can schedule it 1000 per request
// const chunks = _.chunk(data, 1000);
// chunks.forEach((chunk) => index.addObject(chunk));
//crud
// single record create
//index.addObject({ name: "react", rating: 700, objectId: 4 }); //after save to db we will retrieve it back and the send to algolia using its id as objectId
//multiple record
// index.addObjects([
//   { name: "react", rating: 700, objectId: 4 },
//   { name: "vue", rating: 500, objectId: 5 },
// ]);
//update exist record single
// const newRecord = { name: "vux", rating: 500, objectId: 5 }; //objectId should be the same id of that particular one we save in the db
// index.saveObject(newRecord);
//update exist record multile
// const newRecord = [
//   { name: "redux", rating: 300, objectId: 4 },
//   { name: "vux", rating: 500, objectId: 5 },
// ]; //objectId should be the same id of that particular one we save in the db
// index.saveObjects(newRecord);

//to update part of existing record object
// use partialUpdateObject instead of saveObject
//to update part of existing record  array of object
//  use partialUpdateObjects instead of saveObjects

//delete existing record single
//     index.deleteObject(objectId);
//delete existing record multiple
//     index.deleteObjects([objectId1, objectId2]);
//   } catch (error) {
//     console.log(error);
//   }
// });

// index.search("john").then((result) => {
//   console.log(result.nbHits);
//   for (const hit of result.hits) {
//     console.log(hit);
//   }
// });

//this will return the whole record
// index.search("").then((result) => {
//   console.log(result.nbHits);
//   for (const hit of result.hits) {
//     console.log(hit);
//   }
// });
// getMonth();

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   winston.info(`Server is running at port ${PORT}`);
// });
