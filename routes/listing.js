const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const { storage } = require("../cloudconfig.js");

const upload = multer({ storage })

router.route("/")
   .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
          validateListing,
          upload.single('listing[image]'),
           wrapAsync(listingController.createListings))

router.get("/new", isLoggedIn,(listingController.renderNewform))



router.route("/:id")
   .get(wrapAsync(listingController.showListings))
   .put(
       isLoggedIn,
       isOwner,
       upload.single('listing[image]'),
       validateListing,
       wrapAsync (listingController.updateListings))
    .delete(
        isLoggedIn, 
        isOwner,
        wrapAsync (listingController.deleteListings)); 

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync (listingController.editListings));

module.exports = router;