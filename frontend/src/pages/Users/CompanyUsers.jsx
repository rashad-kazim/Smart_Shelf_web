// src/pages/Users/CompanyUsers.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";
import { PlusCircle, RotateCcw } from "lucide-react";
import { mockStores } from "../../data/mockStores";

const CompanyUsers = () => {
  const {
    profileUser,
    currentColors: colors,
    appTranslations,
    language,
    companyUsers,
    setCompanyUsers,
    // DÜZELTME: Dialog fonksiyonları context'ten alınıyor
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    setDialogConfirmationText,
  } = useAuth();

  const navigate = useNavigate();
  const translations = useMemo(
    () => appTranslations[language]?.users || {},
    [appTranslations, language]
  );

  const [filters, setFilters] = useState({ country: "", city: "" });

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;

  useEffect(() => {
    if (!isAdmin && profileUser?.country) {
      setFilters((prev) => ({ ...prev, country: profileUser.country }));
    }
  }, [profileUser, isAdmin]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    if (isAdmin) {
      setFilters({ country: "", city: "" });
    } else {
      setFilters((prev) => ({ ...prev, city: "" }));
    }
  };

  const uniqueCountries = useMemo(() => {
    if (isAdmin) {
      return [...new Set(mockStores.map((store) => store.country))].sort();
    }
    if (isCountryChief) {
      return [profileUser?.country].filter(Boolean);
    }
    return [];
  }, [profileUser, isAdmin, isCountryChief]);

  const uniqueCities = useMemo(() => {
    let relevantStores = mockStores;
    if (filters.country) {
      relevantStores = relevantStores.filter(
        (store) => store.country === filters.country
      );
    }
    return [...new Set(relevantStores.map((store) => store.city))]
      .filter(Boolean)
      .sort();
  }, [filters.country]);

  const filteredUsers = useMemo(() => {
    let baseUsers = companyUsers;
    if (isCountryChief) {
      baseUsers = companyUsers.filter(
        (user) => user.country === profileUser?.country
      );
    }
    return baseUsers.filter((user) => {
      const countryMatch =
        filters.country === "" || user.country === filters.country;
      const cityMatch =
        filters.city === "" || !user.city || user.city === filters.city;
      return countryMatch && cityMatch;
    });
  }, [companyUsers, filters, profileUser, isCountryChief]);

  // DÜZELTME: Silme fonksiyonu onay mekanizmasını kullanacak şekilde güncellendi
  const handleDeleteUser = (userToDelete) => {
    if (!isAdmin && !isCountryChief) return;

    const confirmationFullName = `${userToDelete.name} ${userToDelete.surname}`;

    setDialogTitle(
      translations.confirmDeleteUserTitle || "Confirm User Deletion"
    );
    setDialogMessage(
      `${
        translations.confirmDeleteUserMessage ||
        "Are you sure you want to delete"
      } '${confirmationFullName}'?`
    );
    setDialogConfirmationText(confirmationFullName); // Onay için kullanıcının tam adını ayarla
    setDialogType("confirm");

    setDialogCallback(() => () => {
      setCompanyUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );
    });

    setShowDialog(true);
  };

  const handleEditUser = (userId) => {
    navigate(`/users/company/edit/${userId}`);
  };

  const handleAddNewUser = () => {
    navigate("/users/company/add");
  };

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
      <h1 className="text-3xl font-semibold mb-6">
        {translations.userForCompanyTitle || "Users For Company"}
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleAddNewUser}
          className="px-6 py-3 rounded-md font-medium flex items-center justify-center"
          style={{
            backgroundColor: colors.logoPrimaryBlue,
            color: colors.whiteText,
          }}>
          <PlusCircle size={20} className="mr-2" />{" "}
          {translations.addNewUserButton || "Add New User"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            disabled={!isAdmin}
            className="w-full p-2 rounded-md border cursor-pointer"
            style={{
              borderColor: colors.mediumGrayText,
              backgroundColor: colors.lightGrayBg,
              color: colors.darkText,
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
            disabled={!filters.country}
            className="w-full p-2 rounded-md border cursor-pointer"
            style={{
              borderColor: colors.mediumGrayText,
              backgroundColor: colors.lightGrayBg,
              color: colors.darkText,
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
          className="px-4 py-2 rounded-md font-medium flex items-center inline-flex"
          style={{
            backgroundColor: colors.logoPrimaryBlue,
            color: colors.whiteText,
          }}>
          <RotateCcw size={18} className="mr-2" />{" "}
          {translations.clearFilters || "Clear Filters"}
        </button>
      </div>

      <div
        className="overflow-x-auto rounded-lg border"
        style={{ borderColor: colors.mediumGrayText }}>
        <table
          className="min-w-full divide-y"
          style={{ borderColor: colors.mediumGrayText }}>
          <thead style={{ backgroundColor: colors.lightGrayBg }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.nameSurnameHeader || "Name"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.countryHeader || "Country"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.cityHeader || "City"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.roleHeader || "Role"}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: colors.pureWhite }}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  style={{ borderColor: colors.lightGrayBg }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.name} {user.surname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md">
                      {translations.editButton || "Edit"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md">
                      {translations.deleteButton || "Delete"}
                    </button>
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

export default CompanyUsers;
