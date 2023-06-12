const { check , body} = require("express-validator");

module.exports = [
    check("title")
        .notEmpty().withMessage("debe contenter un titulo").bail(),
    
    check("rating")
        .notEmpty().withMessage("debe contenter un rating").bail()
        ,

    check("awards")
        .notEmpty().withMessage("debe contenter un premio").bail(),

    check("release_date")
        .notEmpty().withMessage("debe contenter una fecha de lanzamiento").bail(),

    check("length")
        .notEmpty().withMessage("debe contenter una duracion").bail(),
]