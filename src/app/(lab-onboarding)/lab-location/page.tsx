"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  doc,
  updateDoc,
  GeoPoint,
} from "firebase/firestore";
import { app } from "../../../../lib/firebase";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

maptilersdk.config.apiKey = "IS3cIJsI4oL56vExWNLY";

function LocationPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<maptilersdk.Map | null>(null);
  const markerRef = useRef<maptilersdk.Marker | null>(null);
  const [labId, setLabId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<MapTilerFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const db = getFirestore(app);

  // Reverse geocode function using MapTiler
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=IS3cIJsI4oL56vExWNLY`
      );
      const data = await res.json();
      return data.features?.[0]?.place_name || "Unknown location";
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return "Unknown location";
    }
  };

  // Geocoding search
  useEffect(() => {
    if (search.length < 3) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(
            search
          )}.json?key=IS3cIJsI4oL56vExWNLY`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
    return () => controller.abort();
  }, [search]);

  useEffect(() => {
    const labDocId = localStorage.getItem("labDocId");
    if (!labDocId) {
      setError("Lab registration not found. Please register again.");
    }
    setLabId(labDocId);

    if (!mapRef.current) return;

    const newMap = new maptilersdk.Map({
      container: mapRef.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [78.9629, 20.5937], // Default to India
      zoom: 4,
    });

    newMap.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) markerRef.current.remove();

      const newMarker = new maptilersdk.Marker().setLngLat([lng, lat]).addTo(newMap);
      markerRef.current = newMarker;

      setLatLng({ lat, lng });
    });

    setMap(newMap);

    return () => {
      newMap.remove();
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);

  const locateUser = () => {
    if (!navigator.geolocation || !map) {
      setError("Geolocation not supported or map not loaded.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatLng({ lat: latitude, lng: longitude });
        map.setCenter([longitude, latitude]);
        map.setZoom(14);

        if (markerRef.current) markerRef.current.remove();
        const newMarker = new maptilersdk.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map);
        markerRef.current = newMarker;
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  type MapTilerFeature = {
    id: string;
    place_name: string;
    geometry: {
      coordinates: [number, number];
    };
  };

  const handleSuggestionClick = (feature: MapTilerFeature) => {
    setShowSuggestions(false);
    setSearch(feature.place_name);
    const [lng, lat] = feature.geometry.coordinates;
    setLatLng({ lat, lng });
    if (map) {
      map.setCenter([lng, lat]);
      map.setZoom(14);
      if (markerRef.current) markerRef.current.remove();
      const newMarker = new maptilersdk.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
      markerRef.current = newMarker;
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!latLng || !labId) {
        setError("Please select a location on the map.");
        return;
      }

      try {
        const locationString = await reverseGeocode(latLng.lat, latLng.lng);

        await updateDoc(doc(db, "LabData", labId), {
          location: new GeoPoint(latLng.lat, latLng.lng),
          locationString, // Save human-readable name
        });

        router.push("/available-tests");
      } catch (err) {
        console.error("Error updating location:", err);
        setError("Failed to update location. Try again.");
      }
    },
    [latLng, labId, db, router]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00ACC1]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl">
        <h1 className="text-2xl font-bold text-[#374151] mb-4 text-center">
          Set Your Lab Location
        </h1>
        <p className="text-sm text-[#374151] text-center mb-4">
          Click on the map, search, or use the icon to auto-detect your lab location.
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a location..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow max-h-48 overflow-auto">
              {suggestions.map((feature) => (
                <li
                  key={feature.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(feature)}
                >
                  {feature.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <div className="text-sm text-[#F57F17] mb-4 text-center">{error}</div>
        )}

        <div className="w-full h-64 rounded overflow-hidden mb-4" ref={mapRef} />

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={locateUser}
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            📍 Use My Location
          </button>
          {latLng && (
            <span className="text-sm text-gray-700">
              Selected: {latLng.lat.toFixed(4)}, {latLng.lng.toFixed(4)}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <button
            type="submit"
            className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200 hover:cursor-pointer"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default LocationPage;
