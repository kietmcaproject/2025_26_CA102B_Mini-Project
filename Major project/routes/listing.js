const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");


// INDEX ROUTE — show all listings
router.get("/", wrapAsync(listingController.index));

// NEW ROUTE — show form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// CREATE ROUTE — add new listing to DB
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

// SHOW ROUTE — show single listing
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT ROUTE — form to edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// UPDATE ROUTE — update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE ROUTE — delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
