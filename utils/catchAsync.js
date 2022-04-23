// returns a function that accpets a function and executes it once errors are caught, next is called and the code the continue.

module.exports = func => {
    return(req, res, next) =>{
        func(req, res, next).catch(next);
    }
}