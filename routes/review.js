const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");
const review = require("../models/review.js");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReviews));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewControllers.deleteReview)); 

module.exports = router;