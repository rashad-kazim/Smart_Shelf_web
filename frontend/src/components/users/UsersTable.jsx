// src/components/users/UsersTable.jsx

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import GlobalLoader from "../common/GlobalLoader";

const UsersTable = ({ users, isLoading, renderActions, type = "company" }) => {
  const { currentColors, appTranslations, language, isDarkMode } = useAuth();

  const userTranslations = useMemo(
    () => appTranslations[language]?.users || appTranslations.en?.users,
    [appTranslations, language]
  );
  const commonTranslations = useMemo(
    () => appTranslations[language]?.common || appTranslations.en?.common,
    [appTranslations, language]
  );

  // Define column structures and data keys centrally
  const columns = {
    company: [
      { headerKey: "avatar", dataKey: "avatar" },
      { headerKey: "fullNameHeader", dataKey: "fullName" },
      { headerKey: "roleHeader", dataKey: "role" },
      { headerKey: "countryHeader", dataKey: "country" },
      { headerKey: "cityHeader", dataKey: "city" },
    ],
    supermarket: [
      { headerKey: "avatar", dataKey: "avatar" },
      { headerKey: "fullNameHeader", dataKey: "fullName" },
      { headerKey: "roleHeader", dataKey: "role" },
      { headerKey: "assignedStoreHeader", dataKey: "assigned_store_name" },
      { headerKey: "countryHeader", dataKey: "country" },
      { headerKey: "cityHeader", dataKey: "city" },
    ],
  };

  const activeColumns = columns[type] || [];

  // Function to generate the content of each cell
  const renderCell = (user, column) => {
    switch (column.dataKey) {
      case "avatar":
        return (
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={
                user.profile_picture ||
                `https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=random&color=fff`
              }
              alt={`${user.name} ${user.surname}`}
            />
          </div>
        );
      case "fullName":
        return `${user.name} ${user.surname}`;
      // '|| "-"' check in case data is not received from the backend
      default:
        return user[column.dataKey] || "-";
    }
  };

  return (
    <div
      className="rounded-lg border min-h-[400px] max-h-[600px] overflow-x-auto  overflow-y-auto "
      style={{ borderColor: currentColors.borderColor }}>
      <table
        className="min-w-full divide-y"
        style={{ borderColor: currentColors.borderColor }}>
        <thead style={{ backgroundColor: currentColors.lightGrayBg }}>
          <tr>
            {activeColumns.map((col) => (
              <th
                key={col.headerKey}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentColors.darkText }}>
                {userTranslations[col.headerKey] ||
                  col.headerKey.replace("Header", "")}
              </th>
            ))}
            <th className="relative px-6 py-3">
              <span className="sr-only">{commonTranslations.actionsLabel}</span>
            </th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{
            backgroundColor: currentColors.pureWhite,
            borderColor: currentColors.borderColor,
          }}>
          {isLoading ? (
            <tr>
              <td
                colSpan={activeColumns.length + 1}
                className="text-center p-8">
                <div className="flex justify-center items-center">
                  <GlobalLoader />
                </div>
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className={`transition-colors duration-150 ${
                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}>
                {activeColumns.map((col) => (
                  <td
                    key={col.dataKey}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ color: currentColors.darkText }}>
                    {renderCell(user, col)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderActions && renderActions(user)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={activeColumns.length + 1}
                className="text-center py-8 px-4 text-sm"
                style={{ color: currentColors.mediumGrayText }}>
                {userTranslations.noUsersFound}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
