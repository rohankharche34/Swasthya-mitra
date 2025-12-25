import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 14, {
        animate: true
      });
    }
  }, [location]);

  return null;
}
export default RecenterMap;