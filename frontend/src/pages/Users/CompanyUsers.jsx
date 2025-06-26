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

  // Silme onayı için diyalog penceresi state'leri
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  // Merkezi filtreleme mantığını hook'tan alıyoruz
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

  // Çeviri metinlerini useMemo ile kararlı hale getiriyoruz
  const pageTranslations = useMemo(
    () => appTranslations[language]?.users?.companyUsersPage || {},
    [appTranslations, language]
  );
  const userTranslations = useMemo(
    () => appTranslations[language]?.users || {},
    [appTranslations, language]
  );

  // Backend'den şirket kullanıcılarını çeken ana fonksiyon
  const fetchCompanyUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/users?user_type=company");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch company users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sayfa yüklendiğinde ve kimlik doğrulama bittiğinde kullanıcıları çek
  useEffect(() => {
    if (!isAuthLoading) {
      fetchCompanyUsers();
    }
  }, [fetchCompanyUsers, isAuthLoading]);

  // Kullanıcıyı silen API isteğini gönderen fonksiyon
  const performDelete = async (userId) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
      fetchCompanyUsers(); // Başarılı silme sonrası listeyi yenile
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
    // Artık konsola yazdırmak yerine, kullanıcıyı düzenleme sayfasına yönlendiriyoruz
    navigate(`/users/company/edit/${user.id}`);
  };

  // Silme butonuna tıklandığında onay penceresini hazırlayan fonksiyon
  const handleDelete = (user) => {
    setDialogContent({
      title: userTranslations.confirmDeleteTitle || "Confirm Deletion",
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

  // Tablodaki her satır için aksiyon butonlarını oluşturan fonksiyon
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

  // Kullanıcı bilgileri yüklenene kadar bekle
  if (isAuthLoading || !profileUser) {
    return <GlobalLoader />;
  }

  const isAdmin = profileUser.role === ROLES.ADMIN;

  return (
    <>
      {showDialog && <CustomDialog {...dialogContent} />}
      <div className="p-4 sm:p-6">
        <PageHeader
          title={pageTranslations.title || "Company Users"}
          subtitle={
            pageTranslations.subtitle ||
            "Manage administrators, country chiefs, and engineers"
          }>
          <Link
            to="/users/company/add"
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
