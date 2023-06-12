const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const {validationResult} = require("express-validator");

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        
        db.Genre.findAll()
        .then((allGenres) => {
            res.render("moviesAdd", {
                allGenres
            })

        });


    },
    create: function (req,res) {
        errors = validationResult(req);

        if (errors.isEmpty()) {
            
            const data = req.body
    
            db.Movie.create({
                ...data
            })
            .then(() => {
                res.redirect("/movies")
            })
            
        } else {

            db.Genre.findAll()
        .then((allGenres) => {

            res.render("moviesAdd", {
                allGenres,
                errors: errors.mapped(),
                old : req.body
            })

        });
        }

    },
    edit: function(req,res) {

        const id = req.params.id;
        const Movie = db.Movie.findByPk(id);
        const allGenres = db.Genre.findAll();

        Promise.all([Movie,allGenres])
            .then(([Movie,allGenres]) => {
                res.render("moviesEdit", {
                    
                    Movie,
                    allGenres
                })
            })
        
    },
    update: function (req,res) {

        let errors = validationResult(req);

        if(errors.isEmpty()){

            const MovieId = req.params.id
            
            db.Movie.update({...req.body},{
                where: {
                    id : MovieId
                }
            })
                .then(() => {
                    res.redirect("/movies")
                })
        } else {
            const id = req.params.id;
            const Movie = db.Movie.findByPk(id);
            const allGenres = db.Genre.findAll();

            Promise.all([Movie,allGenres])
                .then(([Movie,allGenres]) => {
                    res.render("moviesEdit", {
                        Movie,
                        allGenres,
                        errors: errors.mapped(),
                        old: req.body
                    })
                })
        }



    },
    delete: function (req,res) {
        const movieId = req.params.id;

        db.Movie.findByPk(movieId)
            .then((Movie) => {

                res.render("moviesDelete", {
                    Movie
                })
            })

    },
    destroy: function (req,res) {
        const movieId = req.params.id;
       
        db.Movie.destroy({
            where:{
                id : movieId
            }
        })
        .then(() => {
            res.redirect("/movies")
        })
    }
}

module.exports = moviesController;