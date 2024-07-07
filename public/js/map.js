
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
  
  container: "map", // container ID
  
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  
  
  center: listing.geometry.coordinates, // starting position [lng, lat]  [77.209, 28.6139]
  
  zoom: 9, // starting zoom
  
  });

console.log(listing.geometry.coordinates);

// const marker = new mapboxgl.Marker()
// .setLngLat(coordinates);
// .addTo(map);

const marker = new mapboxgl.Marker()
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
  .setHTML(`<h3> ${listing.location} </h3> <p>Exact Loccation provided after booking</p>`)
 )
  .addTo(map);


