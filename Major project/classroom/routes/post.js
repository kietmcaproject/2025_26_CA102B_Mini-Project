
const express = require("express");
const router  = express.Router();

//POST
//Index- 
 router.get("/", (req, res) => {
    res.send("GET for users");
});

//SHOW- 
 router.get("/:id", (req, res) => {
    res.send("GET  for  posts id ");
});

//POST- 
 router.post("/", (req, res) => {
    res.send("Post  for  posts");
});

//DLETETE-
 router.delete("/:id", (req, res) => {
    res.send("DELETE  for  post id");
});

module.exports = router;