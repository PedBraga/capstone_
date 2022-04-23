const express = require("express");

class ExpressError extends Error{
    constructor(message, statusCose){
        super();
        this.message = message;
        this.statusCose = statusCose;
    }
}

module.exports = ExpressError;