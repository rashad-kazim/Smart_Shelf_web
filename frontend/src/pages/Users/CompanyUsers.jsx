// src/pages/Users/CompanyUsers.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserFilters } from "../../hooks/useUserFilters";
import { ROLES } from "../../config/roles";
import axiosInstance from "../../api/axiosInstance";
import PageHeader from "../../components/common/PageHeader";
import UsersTable from "../../components/users/UsersTable";
import FilterControls from "../../components/common/FilterControls";
import CustomDialog from "../../components/common/CustomDialog";
import GlobalLoader from "../../components/common/GlobalLoader";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CompanyUsers = () => {
  const { profileUser, isAuthLoading, appTranslations, language } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog state for delete confirmation
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  // Centralized filtering logic from hook
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

  const userTranslations = useMemo(
    () => appTranslations[language]?.users,
    [appTranslations, language]
  );

  const pageTranslations = useMemo(
    () => appTranslations[language]?.["users.companyUsersPage"],
    [appTranslations, language]
  );

  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  // Main function to fetch company users from backend
  const fetchCompanyUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/users?user_type=company");
      setUsers(response.data);
    } catch (err) {
      setError(userTranslations.usersLoadError);
    } finally {
      setIsLoading(false);
    }
  }, [userTranslations]);

  // Fetch users when page loads and after authentication is done
  useEffect(() => {
    if (!isAuthLoading) {
      fetchCompanyUsers();
    }
  }, [fetchCompanyUsers, isAuthLoading]);

  // Function to send API request to delete user
  const performDelete = async (userId) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
      fetchCompanyUsers(); // Refresh list after successful delete
    } catch (err) {
      setError(userTranslations.userDeleteError);
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    // Instead of logging, navigate to user edit page
    navigate(`/users/company/edit/${user.id}`);
  };

  // Function to prepare confirmation dialog when delete button is clicked
  const handleDelete = (user) => {
    setDialogContent({
      title: storesTranslations.confirmDeleteTitle,
      message: `${userTranslations.confirmDeleteMessage} '${user.name} ${user.surname}'?`,
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

  // Function to render action buttons for each row in the table
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

  // Wait until user info is loaded
  if (isAuthLoading || !profileUser) {
    return <GlobalLoader />;
  }

  const isAdmin = profileUser.role === ROLES.ADMIN;

  return (
    <>
      {showDialog && <CustomDialog {...dialogContent} />}
      <div className="p-4 sm:p-6">
        <PageHeader
          title={pageTranslations.title}
          subtitle={pageTranslations.subtitle}>
          <Link
            to="/users/company/add"
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <PlusCircle size={20} className="mr-2" />
            {pageTranslations.addUser}
          </Link>
        </PageHeader>

        <FilterControls
          countryOptions={countryOptions}
          cityOptions={cityOptions}
          selectedCountries={selectedCountries}
          selectedCities={selectedCities}
          onCountryChange={toggleCountry}
          onCityChange={toggleCity}
          onReset={resetFilters}
          isCountryDisabled={!isAdmin}
        />

        {error && (
          <div className="my-4 p-4 text-center text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <UsersTable
          users={filteredUsers}
          isLoading={isLoading}
          renderActions={renderUserActions}
          type="company"
        />
      </div>
    </>
  );
};

export default CompanyUsers;
