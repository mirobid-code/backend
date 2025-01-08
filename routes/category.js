const express = require('express');

const router = express.Router();
const Category = require('../model/category');
const mongoose = require('mongoose');
const Product = require('../model/product');


router.get('/', async (req, res) => {
    try{
       const categoryList = await Category.find().exec();
       res.json(categoryList); 
    }catch(err){
        res.json({message: err});
    }
});


router.post('/', async (req, res) => {
    const {name, description} = req.body;
    const category = new Category({
        name,
        description,
    });
    try{
        const savedCategory = await category.save();
        res.json(savedCategory);
    }catch(error){
        res.json({message: error});
    }
});


router.get('/:id', async (req, res) => {
    try{
        const category = await Category.findById(req.params.id).exec();
        res.json(category);
    }catch(err){
        res.json({message: err});
    }
});

router.put('/:id', async (req, res) => {
    const{name, description} = req.body;
    const {id} = req.params;

    try{
        const updateCategory = await Category.findByIdAndUpdate(
            id,
             {name, description},
             {new: true});
        res.json(updateCategory);
    } catch(err){
        res.json({message: err});
    }
});


router.delete('/:id', async (req, res) => {
    try{
        const removeCategory = await Category.findByIdAndRemove(req.params.id);
        res.json(removeCategory);
    }catch(err){
        res.json({message: err});
    }
});

 



module.exports = router;