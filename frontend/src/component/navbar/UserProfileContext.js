import React, { createContext, useState } from "react";

export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    profileImageUrl: "",
  });

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};