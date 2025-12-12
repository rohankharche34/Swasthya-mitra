import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import RecenterMap from "./RecenterMap"
import polyline from "@mapbox/polyline";


// ✅ Fix Leaflet marker icons
const defaultIcon = L.icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const userIcon = L.icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const hospitalIcon = L.icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

function HospitalMap() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [route, setRoute] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setCurrentLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => {
      console.log("Location error:", err);

      // ✅ Fallback location (Kolkata)
      setCurrentLocation({
        lat: 22.5726,
        lng: 88.3639,
      });

      alert("Using approximate location (GPS timeout)");
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,      // ✅ Increase timeout
      maximumAge: 10000,
    }
  );
}, []);



  useEffect(() => {
    if (!currentLocation) return;

    const fetchHospitals = async () => {
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:50000,${currentLocation.lat},${currentLocation.lng});
          way["amenity"="hospital"](around:50000,${currentLocation.lat},${currentLocation.lng});
        );
        out center;
      `;

      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query
      );

      setHospitals(response.data.elements);
    };

    fetchHospitals();
  }, [currentLocation]);

  const getRoute = async (destLat, destLng) => {
  if (!currentLocation) {
    alert("Current location not available");
    return;
  }

  try {
    const url = "https://api.openrouteservice.org/v2/directions/driving-car";

    const body = {
      coordinates: [
        [currentLocation.lng, currentLocation.lat],
        [destLng, destLat],
      ],
    };

    const res = await axios.post(url, body, {
      headers: {
        "Authorization": "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE0NGMyNTU3NDQ2NzQ0YThiMTg4NzhjMDUxN2Y5OTEyIiwiaCI6Im11cm11cjY0In0=",
        "Content-Type": "application/json",
      },
    });

    console.log("ORS response:", res.data);

    // New structure:
    const route = res.data.routes?.[0];
    if (!route) {
      alert("No route found");
      return;
    }

    // Decode polyline geometry from ORS format
    const coords = polyline.decode(route.geometry).map((c) => [c[0], c[1]]);

    setRoute(coords);

    setRouteInfo({
      distance: (route.summary.distance / 1000).toFixed(2) + " km",
      duration: Math.round(route.summary.duration / 60) + " mins",
    });

  } catch (err) {
    console.error("ORS Route error:", err.response?.data || err);
    alert("Routing failed. See console.");
  }
};



  return (
    <div style={{ height: "80vh", width: "100vw", position: "absolute" ,right:"0"}}>
      <MapContainer
        
        center={currentLocation || { lat: 22.5726, lng: 88.3639 }}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <RecenterMap location={currentLocation} />
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={userIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {hospitals.map((h, i) => {
          const lat = h.lat || h.center?.lat;
          const lng = h.lon || h.center?.lon;
          if (!lat || !lng) return null;

          return (
            <Marker
              key={i}
              position={[lat, lng]}
              icon={hospitalIcon}
              eventHandlers={{
                click: () => getRoute(lat, lng),
              }}
            >
              <Popup>
                <b>{h.tags?.name || "Hospital"}</b>
              </Popup>
            </Marker>
          );
        })}

       {route.length > 0 && (
      <Polyline
        positions={route}
        pathOptions={{ color: "blue", weight: 5 }}
      />
    )}

      </MapContainer>
      
      {routeInfo && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "20px",
            background: "rgba(255, 255, 255, 0.95)",
            padding: "15px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
            fontSize: "16px",
            fontWeight: 600,
            color: "#333",
          }}
        >
          <p style={{ margin: "0 0 8px 0" }}>📍 Distance: {routeInfo.distance}</p>
          <p style={{ margin: 0 }}>⏱️ Time: {routeInfo.duration}</p>
        </div>
      )}
    </div>
  );
}

export default HospitalMap;
