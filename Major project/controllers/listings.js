const Listing = require("../models/listing");

module.exports.index = async(req, res)=> {
    try {
        const allListings = await Listing.find({});
        // Normalize image URL for each listing so views can use `imageUrl`
        for (let l of allListings) {
            // if image is stored as object with .url
            if (l.image && typeof l.image === "object" && l.image.url) {
                l.imageUrl = l.image.url;
            } else if (l.image && typeof l.image === "string") {
                // sometimes image was saved as a stringified object; try to extract the first http(s) URL
                const m = l.image.match(/https?:\/\/[^'"\s]+/);
                l.imageUrl = m ? m[0] : l.image;
            } else {
                l.imageUrl = "https://via.placeholder.com/400x300?text=No+Image";
            }
        }
        console.log(`Found ${allListings.length} listings`);
        if (allListings.length > 0) {
            console.log("Sample listing:", {
                title: allListings[0].title,
                price: allListings[0].price,
                location: allListings[0].location
            });
        }
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error("Error in index route:", err);
        res.status(500).send("Error fetching listings");
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res )=> {
    let {id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },

    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    // normalize image for show page too
    if (listing.image && typeof listing.image === "object" && listing.image.url) {
        listing.imageUrl = listing.image.url;
    } else if (listing.image && typeof listing.image === "string") {
        const m = listing.image.match(/https?:\/\/[^'"\s]+/);
        listing.imageUrl = m ? m[0] : listing.image;
    } else {
        listing.imageUrl = "https://via.placeholder.com/800x400?text=No+Image+Available";
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm =  async (req, res) => {
    let {id} = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exits!");
        return res.redirect("/listings");
  }
    // normalize image for edit form
    if (listing.image && typeof listing.image === "object" && listing.image.url) {
        listing.imageUrl = listing.image.url;
    } else if (listing.image && typeof listing.image === "string") {
        const m = listing.image.match(/https?:\/\/[^'"\s]+/);
        listing.imageUrl = m ? m[0] : listing.image;
    } else {
        listing.imageUrl = "";
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing =  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}


















































