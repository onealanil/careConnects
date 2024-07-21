import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

export const UserProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedCurrentUser = await AsyncStorage.getItem('currentUser');
      console.log("this is user context", storedCurrentUser)
      setCurrentUser(storedCurrentUser);
    };

    fetchUser();
  }, []);

  const values = {
    currentUser,
    setCurrentUser,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
