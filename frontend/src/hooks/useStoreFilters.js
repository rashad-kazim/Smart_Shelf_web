// src/hooks/useStoreFilters.js

import { useState, useMemo } from "react";
import { ROLES } from "../config/roles";

const capitalize = (s) =>
  s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : "";

export const useStoreFilters = (initialStores = [], profileUser) => {
  const isAdmin = profileUser?.role === ROLES.ADMIN;

  const [selectedCountries, setSelectedCountries] = useState(
    isAdmin ? [] : profileUser?.country ? [capitalize(profileUser.country)] : []
  );
  // 1. FIX: selectedCity is now an array: selectedCities
  const [selectedCities, setSelectedCities] = useState([]);

  const countryOptions = useMemo(() => {
    if (!initialStores) return [];
    if (isAdmin) {
      const countries = [
        ...new Set(initialStores.map((s) => s.country).filter(Boolean)),
      ];
      return countries.map(capitalize).sort();
    }
    return profileUser?.country ? [capitalize(profileUser.country)] : [];
  }, [initialStores, isAdmin, profileUser?.country]);

  const cityOptions = useMemo(() => {
    if (!initialStores || selectedCountries.length === 0) return [];
    const storesToFilter = initialStores.filter((store) =>
      selectedCountries.includes(capitalize(store.country))
    );
    const cities = [
      ...new Set(storesToFilter.map((s) => s.city).filter(Boolean)),
    ];
    return cities.map(capitalize).sort();
  }, [initialStores, selectedCountries]);

  const filteredStores = useMemo(() => {
    if (!initialStores) return [];
    return initialStores.filter((store) => {
      const countryMatch =
        selectedCountries.length === 0 ||
        selectedCountries.includes(capitalize(store.country));
      // 2. FIX: City filter now searches in array
      const cityMatch =
        selectedCities.length === 0 ||
        selectedCities.includes(capitalize(store.city));
      return countryMatch && cityMatch;
    });
  }, [initialStores, selectedCountries, selectedCities]);

  const toggleCountry = (country) => {
    if (!isAdmin) return;
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  // 3. FIX: New toggle function to manage cities
  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  // 4. FIX: Reset function now also resets selectedCities
  const resetFilters = () => {
    if (!isAdmin) {
      setSelectedCities([]);
    } else {
      setSelectedCountries([]);
      setSelectedCities([]);
    }
  };

  return {
    filteredStores,
    countryOptions,
    cityOptions,
    selectedCountries,
    selectedCities,
    toggleCountry,
    toggleCity,
    resetFilters,
  };
};
