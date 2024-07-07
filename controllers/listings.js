const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index =  async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
};

module.exports.renderNewform =  (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    
        const listing = await Listing.findById(id)
        .populate({path:"reviews", populate: {path : "author"},})
        .populate("owner");

        try{
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings"); // Make sure to return here to avoid rendering the view
        }
        // console.log(listing);
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.log(err);
        req.flash("error", "An error occurred while retrieving the listing.");
        res.redirect("/listings");
    }
};

module.exports.createListings = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename}

    newlisting.geometry = response.body.features[0].geometry;
    let savedListing = await newlisting.save();
    console.log(savedListing);
    req.flash("success", "New listing created")
    res.redirect("/listings");
};

module.exports.editListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    try{
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings"); // Make sure to return here to avoid rendering the view
        }
    } catch (err) {
        console.log(err);
        req.flash("error", "An error occurred while retrieving the listing.");
        res.redirect("/listings");
    }
    let originalUrlImage = listing.image.url;
    originalUrlImage = originalUrlImage.replace("/upload", "/upload/h_3000,w_250")
    res.render("listings/edit.ejs", {listing, originalUrlImage});  
};

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})  //Spread syntax {...} object ke properties ko alag-alag kar deta hai aur ek naya object banata hai.
                                                                              //{...req.body.listing} ka matlab hai ki req.body.listing object ke sabhi properties ko naya object mein spread kar do.
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename}
    await listing.save();
    }
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "New listing deleted")
    res.redirect("/listings");
};
