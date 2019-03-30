var map = L.map("map", {
  zoomControl: true,
  maxZoom: 20,
  minZoom: 1,
  attributionControl: false
}).setView([38.717, -87.67], 9);

L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
  opacity: 1.0,
  maxZoom: 20,
  minZoom: 1
}).addTo(map);

let cluster_points = L.markerClusterGroup({
  showCoverageOnHover: false,
  spiderfyDistanceMultiplier: 2,
  disableClusteringAtZoom: 16,
  chunkedLoading: true
});
let cluster_address = L.markerClusterGroup({
  showCoverageOnHover: false,
  spiderfyDistanceMultiplier: 2,
  disableClusteringAtZoom: 16,
  chunkedLoading: true
});

fetch("data/mappoints.json")
  .then(res => res.json())
  .then(data => {
    const markerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    function pop_points(feature, layer) {
      var popupContent = `
      <table>
        <tr><td colspan="2" style="white-space: nowrap;"><b>Map Loc: </b>${feature.properties["e"]}</td></tr>
        <tr><td colspan="2"><b>Type: </b>${feature.properties["m"]}</td></tr>
        <tr><td colspan="2"><b>County: </b>${feature.properties["c"]}</td></tr>
        <tr><td colspan="2"><b>Township: </b>${
          feature.properties["t"]
        }</td></tr>
      </table>
    `;
      layer.bindPopup(popupContent, {
        maxHeight: 400
      });
    }

    cluster_points
      .addLayer(
        L.geoJson(data, {
          onEachFeature: pop_points,
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, markerOptions);
          }
        })
      )
      .addTo(map);
  });
fetch("data/address.json")
  .then(res => res.json())
  .then(data => {
    const markerOptions = {
      radius: 8,
      fillColor: "rgba(183,0,3,1.0)",
      color: "rgba(35,35,35,1.0)",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
    function pop_address(feature, layer) {
      var popupContent = `
      <table>
        <tr><td colspan="2" style="white-space: nowrap;"><b>Address: </b>${feature.properties["a"]}</td></tr>
        <tr><td colspan="2"><b>City: </b>${feature.properties["ci"]}</td></tr>
        <tr><td colspan="2"><b>State: </b>${feature.properties["s"]}</td></tr>
        <tr><td colspan="2"><b>Zip: </b>${feature.properties["z"]}</td></tr>
        <tr><td colspan="2"><b>County: </b>${feature.properties["c"]}</td></tr>
        <tr><td colspan="2"><b>Township: </b>${
          feature.properties["t"]
        }</td></tr>
      </table>
    `;
      layer.bindPopup(popupContent, {
        maxHeight: 400
      });
    }

    cluster_address.addLayer(
      L.geoJson(data, {
        onEachFeature: pop_address,
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, markerOptions);
        }
      })
    );
  });

L.control
  .layers(
    {},
    {
      "Map Points": cluster_points,
      "Addresses": cluster_address
    },
    {
      collapsed: false
    }
  )
  .addTo(map);

const measureControl = new L.Control.Measure({
  position: "topleft",
  activeColor: "#75d8f7",
  completedColor: "#74b7f7",
  primaryLengthUnit: "feet",
  secondaryLengthUnit: "miles",
  primaryAreaUnit: "sqfeet",
  secondaryAreaUnit: "sqmiles"
}).addTo(map);

const Geocoder = new L.Control.Geocoder({
  collapsed: true,
  position: "topleft",
  text: "Search",
  title: ""
}).addTo(map);

const searchMap = new L.Control.Search({
  layer: cluster_points,
  initial: false,
  zoom: 17,
  hideMarkerOnCollapse: true,
  propertyName: "e"
}).addTo(map);

document.querySelector(".leaflet-control-measure-toggle").innerHTML = "";