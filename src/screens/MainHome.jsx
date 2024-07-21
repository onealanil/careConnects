import React, { useState, useEffect } from "react";
import { useGlobalStore } from "../global/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";

const MainHome = React.memo(() => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await useGlobalStore.getState().checkAuth();

                if (response) {
                    const getUser = useGlobalStore.getState().user;
                    if (getUser && getUser.role === "user") {
                        navigation.navigate("regular_user");
                    } else if (getUser && getUser.role === "care_giver") {
                        navigation.navigate("care_giver");
                    }
                } else {
                    await AsyncStorage.removeItem("currentUser");
                    useGlobalStore.setState({ user: null });
                    navigation.navigate("Login");
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                navigation.navigate("Login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthentication();
    }, [navigation]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }
    return null;
});

export default MainHome;