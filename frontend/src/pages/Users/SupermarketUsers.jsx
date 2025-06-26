// src/pages/Users/SupermarketUsers.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserFilters } from "../../hooks/useUserFilters";
import { ROLES } from "../../config/roles";
import axiosInstance from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom"; // Link ve useNavigate eklendi
import PageHeader from "../../components/common/PageHeader";
import UsersTable from "../../components/users/UsersTable";
import FilterControls from "../../components/common/FilterControls";
import CustomDialog from "../../components/common/CustomDialog";
import GlobalLoader from "../../components/common/GlobalLoader";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

const SupermarketUsers = () => {
  const { profileUser, isAuthLoading, appTranslations, language } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Silme onayı için diyalog penceresi state'leri
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  const {
    filteredUsers,
    countryOptions,
    cityOptions,
    selectedCountries,
    selectedCities,
    toggleCountry,
    toggleCity,
    resetFilters,
  } = useUserFilters(users, profileUser);

  const pageTranslations = useMemo(
    () => appTranslations[language]?.users?.supermarketUsersPage || {},
    [appTranslations, language]
  );
  const userTranslations = useMemo(
    () => appTranslations[language]?.users || {},
    [appTranslations, language]
  );

  const fetchSupermarketUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        "/api/users?user_type=supermarket"
      );
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch supermarket users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchSupermarketUsers();
    }
  }, [fetchSupermarketUsers, isAuthLoading]);

  const performDelete = async (userId) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
      fetchSupermarketUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(
        err.response?.data?.detail ||
          "An error occurred while deleting the user."
      );
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    navigate(`/users/supermarket/edit/${user.id}`);
  };

  const handleDelete = (user) => {
    setDialogContent({
      title: userTranslations.confirmDeleteTitle || "Confirm User Deletion",
      message: `${
        userTranslations.confirmDeleteMessage ||
        "Are you sure you want to delete"
      } '${user.name} ${user.surname}'?`,
      type: "confirm",
      confirmationText: `${user.name} ${user.surname}`,
      onConfirm: () => {
        setShowDialog(false);
        performDelete(user.id);
      },
      onCancel: () => setShowDialog(false),
    });
    setShowDialog(true);
  };

  const renderUserActions = (user) => (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={() => handleEdit(user)}
        className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
        <Edit size={18} />
      </button>
      <button
        onClick={() => handleDelete(user)}
        className="p-2 text-gray-400 hover:text-red-600 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  );

  if (isAuthLoading || !profileUser) {
    return <GlobalLoader />;
  }

  const isAdmin = profileUser.role === ROLES.ADMIN;

  return (
    <>
      {showDialog && <CustomDialog {...dialogContent} />}
      <div className="p-4 sm:p-6">
        <PageHeader
          title={pageTranslations.title || "Supermarket Users"}
          subtitle={
            pageTranslations.subtitle ||
            "Manage users assigned to specific supermarket branches"
          }>
          <Link
            to="/users/supermarket/add"
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <PlusCircle size={20} className="mr-2" />
            {pageTranslations.addUser || "Add User"}
          </Link>
        </PageHeader>

        <FilterControls
          countryOptions={countryOptions}
          cityOptions={cityOptions}
          selectedCountries={selectedCountries}
          selectedCities={selectedCities}
          toggleCountry={toggleCountry}
          toggleCity={toggleCity}
          resetFilters={resetFilters}
          isCountryDisabled={!isAdmin}
        />

        {error && (
          <div className="my-4 p-4 text-center text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <UsersTable
          users={filteredUsers}
          isLoading={isLoading}
          renderActions={renderUserActions}
          type="supermarket"
        />
      </div>
    </>
  );
};

export default SupermarketUsers;
