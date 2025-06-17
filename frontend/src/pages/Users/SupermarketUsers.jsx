// src/pages/Users/SupermarketUsers.js
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";
import { PlusCircle, RotateCcw } from "lucide-react";
import { mockStores } from "../../data/mockStores";

const SupermarketUsers = () => {
  const {
    profileUser,
    currentColors,
    appTranslations,
    language,
    users,
    setUsers,
  } = useAuth();

  const navigate = useNavigate();
  const translations = appTranslations[language]?.users || {};

  const [filters, setFilters] = useState({
    storeName: "",
    country: "",
    city: "",
  });

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;
  const isAnalyst = profileUser?.role === ROLES.ANALYST;
  const isEngineer = profileUser?.role === ROLES.ENGINEER;

  useEffect(() => {
    if (
      !isAdmin &&
      !(isEngineer && profileUser?.country === "Global") &&
      profileUser?.country
    ) {
      setFilters((prev) => ({ ...prev, country: profileUser.country }));
    }
  }, [profileUser, isAdmin, isEngineer]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    if (isAdmin || (isEngineer && profileUser?.country === "Global")) {
      setFilters({ storeName: "", country: "", city: "" });
    } else {
      setFilters((prev) => ({ ...prev, storeName: "", city: "" }));
    }
  };

  const handleDeleteUser = (userToDelete) => {
    // Gerçek uygulamada burada bir onay dialog'u gösterilir.
    // Şimdilik direkt siliyoruz.
    console.log("Deleting user:", userToDelete);
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userToDelete.id)
    );
  };

  const handleEditUser = (userId) => {
    navigate(`/users/supermarket/edit/${userId}`);
  };

  const handleAddNewUser = () => {
    navigate("/users/supermarket/add");
  };

  const uniqueCountries = useMemo(() => {
    if (isAdmin || (isEngineer && profileUser?.country === "Global")) {
      return [...new Set(mockStores.map((store) => store.country))].sort();
    }
    if (isCountryChief || isAnalyst || isEngineer) {
      return [profileUser?.country].filter(Boolean);
    }
    return [];
  }, [profileUser, isAdmin, isEngineer, isCountryChief, isAnalyst]);

  const uniqueCities = useMemo(() => {
    let relevantStores = mockStores;
    if (filters.country) {
      relevantStores = relevantStores.filter(
        (store) => store.country === filters.country
      );
    } else if (!isAdmin && !(isEngineer && profileUser?.country === "Global")) {
      relevantStores = relevantStores.filter(
        (store) => store.country === profileUser.country
      );
    }
    return [...new Set(relevantStores.map((store) => store.city))]
      .filter(Boolean)
      .sort();
  }, [filters.country, profileUser, isAdmin, isEngineer]);

  const uniqueStores = useMemo(() => {
    let relevantStores = mockStores;
    if (filters.country) {
      relevantStores = relevantStores.filter(
        (s) => s.country === filters.country
      );
    }
    if (filters.city) {
      relevantStores = relevantStores.filter((s) => s.city === filters.city);
    }
    return [...new Set(relevantStores.map((s) => s.name))]
      .filter(Boolean)
      .sort();
  }, [filters.country, filters.city]);

  const filteredUsers = useMemo(() => {
    let baseUsers = users;
    if (!isAdmin && !(isEngineer && profileUser?.country === "Global")) {
      baseUsers = users.filter((user) => user.country === profileUser?.country);
    }
    return baseUsers.filter((user) => {
      const storeMatch =
        filters.storeName === "" || user.storeName === filters.storeName;
      const countryMatch =
        filters.country === "" || user.country === filters.country;
      const cityMatch = filters.city === "" || user.city === filters.city;
      return storeMatch && countryMatch && cityMatch;
    });
  }, [users, filters, profileUser, isAdmin, isEngineer]);

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{
        backgroundColor: currentColors.pureWhite,
        color: currentColors.darkText,
      }}>
      <h1
        className="text-3xl font-semibold mb-6"
        style={{ color: currentColors.darkText }}>
        {translations.usersForSupermarketTitle || "Users For Supermarket"}
      </h1>

      {(isAdmin || isCountryChief || isEngineer) && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddNewUser}
            className="px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors duration-200 cursor-pointer"
            style={{
              backgroundColor: currentColors.logoPrimaryBlue,
              color: currentColors.whiteText,
            }}>
            <PlusCircle size={20} className="mr-2" />{" "}
            {translations.addNewUserButton || "Add New User"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Store Filter */}
        <div>
          <label
            htmlFor="filter-store"
            className="block text-sm font-medium mb-1">
            {translations.store || "Store"}
          </label>
          <select
            id="filter-store"
            name="storeName"
            value={filters.storeName}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-md border"
            style={{
              borderColor: currentColors.mediumGrayText,
              backgroundColor: currentColors.lightGrayBg,
              color: currentColors.darkText,
              outlineColor: currentColors.logoPrimaryBlue, // Noktalı virgül kaldırıldı
            }}>
            <option value="">{translations.allStores || "All Stores"}</option>
            {uniqueStores.map((storeName) => (
              <option key={storeName} value={storeName}>
                {storeName}
              </option>
            ))}
          </select>
        </div>
        {/* Country Filter */}
        <div>
          <label
            htmlFor="filter-country"
            className="block text-sm font-medium mb-1">
            {translations.country || "Country"}
          </label>
          <select
            id="filter-country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            disabled={
              !isAdmin && !(isEngineer && profileUser?.country === "Global")
            }
            className="w-full p-2 rounded-md border"
            style={{
              borderColor: currentColors.mediumGrayText,
              backgroundColor: currentColors.lightGrayBg,
              color: currentColors.darkText,
              outlineColor: currentColors.logoPrimaryBlue, // Noktalı virgül kaldırıldı
            }}>
            <option value="">
              {translations.allCountries || "All Countries"}
            </option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        {/* City Filter */}
        <div>
          <label
            htmlFor="filter-city"
            className="block text-sm font-medium mb-1">
            {translations.city || "City"}
          </label>
          <select
            id="filter-city"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            disabled={
              !filters.country &&
              !isAdmin &&
              !(isEngineer && profileUser?.country === "Global")
            }
            className="w-full p-2 rounded-md border"
            style={{
              borderColor: currentColors.mediumGrayText,
              backgroundColor: currentColors.lightGrayBg,
              color: currentColors.darkText,
              outlineColor: currentColors.logoPrimaryBlue, // Noktalı virgül kaldırıldı
            }}>
            <option value="">{translations.allCities || "All Cities"}</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full text-right mb-4">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors duration-200 cursor-pointer inline-flex"
          style={{
            backgroundColor: currentColors.logoPrimaryBlue,
            color: currentColors.whiteText,
          }}>
          <RotateCcw size={18} className="mr-2" />{" "}
          {translations.clearFilters || "Clear Filters"}
        </button>
      </div>

      <div
        className="overflow-x-auto rounded-lg border"
        style={{ borderColor: currentColors.mediumGrayText }}>
        <table
          className="min-w-full divide-y"
          style={{ borderColor: currentColors.mediumGrayText }}>
          <thead style={{ backgroundColor: currentColors.lightGrayBg }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.nameSurnameHeader || "Name"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.storeNameHeader || "Store"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.branchHeader || "Branch"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.roleHeader || "Role"}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                  style={{ borderColor: currentColors.lightGrayBg }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.name} {user.surname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.storeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.branch || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                    {(isAdmin || isAnalyst || isCountryChief) && (
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md">
                        {translations.editButton || "Edit"}
                      </button>
                    )}
                    {(isAdmin || isCountryChief || isAnalyst) && (
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md">
                        {translations.deleteButton || "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  {translations.noUsersFound || "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupermarketUsers;
