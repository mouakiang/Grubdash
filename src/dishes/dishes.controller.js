const path = require("path");
const express = require("express");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExists(req, res, next){
  const {dishId} = req.params;
  const foundDish = dishes.find((dish) => dish.id === (dishId));
  if (foundDish){
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id does not exist: ${dishId}`,
  });
}

function read(req, res, next) {
 res.json({data: res.locals.dish});
  }


function create(req, res, next) {
  let message = "";
  const { data: { name, description, price, image_url } = {} } = req.body;

  if (!name || name === "") {
    message = "Dish must include a name";
  } else if (!description || description === "") {
    message = "Dish must include a description";
  } else if (!price) {
    message = "Dish must include a price";
  } else if (price <= 0 || !Number.isInteger(price)) {
    message = "Dish must have a price that is an integer greater than 0";
  } else if (!image_url || image_url === "") {
    message = "Dish must include an image_url";
  }

  if (message) {
    return next({
      status: 400,
      message: message,
    });
  }

  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function list(req, res){
  res.json({data: dishes});
}

module.exports = {
  create,
  read: [dishExists, read],
  list,
};