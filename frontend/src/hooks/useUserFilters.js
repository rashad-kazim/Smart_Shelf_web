// src/hooks/useUserFilters.js

import { useState, useMemo } from "react";
import { ROLES } from "../config/roles";

const capitalize = (s) =>
  s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : "";

// This hook is customized for filtering users.
export const useUserFilters = (initialUsers = [], profileUser) => {
  const isAdmin = profileUser?.role === ROLES.ADMIN;

  const [selectedCountries, setSelectedCountries] = useState(
    isAdmin ? [] : profileUser?.country ? [capitalize(profileUser.country)] : []
  );
  const [selectedCities, setSelectedCities] = useState([]);

  const countryOptions = useMemo(() => {
    if (!initialUsers) return [];
    if (isAdmin) {
      const countries = [
        ...new Set(initialUsers.map((u) => u.country).filter(Boolean)),
      ];
      return countries.map(capitalize).sort();
    }
    return profileUser?.country ? [capitalize(profileUser.country)] : [];
  }, [initialUsers, isAdmin, profileUser?.country]);

  const cityOptions = useMemo(() => {
    if (!initialUsers || selectedCountries.length === 0) return [];
    const usersToFilter = initialUsers.filter((user) =>
      selectedCountries.includes(capitalize(user.country))
    );
    const cities = [
      ...new Set(usersToFilter.map((u) => u.city).filter(Boolean)),
    ];
    return cities.map(capitalize).sort();
  }, [initialUsers, selectedCountries]);

  const filteredUsers = useMemo(() => {
    if (!initialUsers) return [];
    return initialUsers.filter((user) => {
      const countryMatch =
        selectedCountries.length === 0 ||
        selectedCountries.includes(capitalize(user.country));
      const cityMatch =
        selectedCities.length === 0 ||
        selectedCities.includes(capitalize(user.city));
      return countryMatch && cityMatch;
    });
  }, [initialUsers, selectedCountries, selectedCities]);

  const toggleCountry = (country) => {
    if (!isAdmin) return;
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const resetFilters = () => {
    if (!isAdmin) {
      setSelectedCities([]);
    } else {
      setSelectedCountries([]);
      setSelectedCities([]);
    }
  };

  return {
    filteredUsers,
    countryOptions,
    cityOptions,
    selectedCountries,
    selectedCities,
    toggleCountry,
    toggleCity,
    resetFilters,
  };
};
