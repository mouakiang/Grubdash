const path = require("path");
const express = require("express");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id does not exist: ${dishId}`,
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

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

function update(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  res.locals.dish = {
    id: res.locals.dish.id,
    name,
    description,
    price,
    image_url,
  };
  res.json({ data: res.locals.dish });
}



function list(req, res) {
  res.json({ data: dishes });
}

function hasName(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function pricePropertyIsValid(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (!Number.isInteger(price) || price <= 0) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  return next();
}

function dishIdCheck(req, res, next) {
  const {data: {id} = {}} = req.body;
  const {dishId} = req.params;
  if(!dishId) {
    return next({
      status: 400, 
      message: `Dish does not exist: ${dishId}.`
    });
  } else if (id && id !== dishId){
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
    });
  }
  return next();
}

module.exports = {
   create: [
      hasName("name"),
      hasName("description"),         hasName("price"), 
      hasName("image_url"),  
      pricePropertyIsValid, 
      create
    ],
  list,
  read: [dishExists, read],
  update: [
      dishExists,
      hasName("name"),
      hasName("description"),
      hasName("price"),
      hasName("image_url"),
      pricePropertyIsValid,
      dishIdCheck,
      update
  ]
};