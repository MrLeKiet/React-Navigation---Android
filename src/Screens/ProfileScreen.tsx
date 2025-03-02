import { View, Text, StyleSheet, Pressable, Alert, Platform, ActivityIndicator, Image, ScrollView } from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { UserDataForm } from "../Componenets/LoginRegisterComponents/UserDataForm";
import { UserType } from "../Componenets/LoginRegisterComponents/UserContent";
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";

type Props = {};

const ProfileScreen = ({ navigation, route }: TabsStackScreenProps<"Profile">) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNo: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
    const [showRegistrationScreen, setShowRegistrationScreen] = useState<boolean>(false); // Ensure this state is defined
    const { getUserId, setGetUserId } = useContext(UserType);
    const [userLoginForm, setUserLoginForm] = useState({ email: "", password: "" });
    const [userSignupForm, setUserSignupForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNo: "",
        password: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registrationError, setRegistrationError] = useState<string | null>(null);

    // Fetch user profile if logged in
    const fetchUserProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log("Fetching user profile...");
        try {
            const token = await AsyncStorage.getItem("authToken");
            console.log("Auth token:", token);
            if (!token) {
                setIsLoggedIn(false);
                setUser({ firstName: "", lastName: "", email: "", mobileNo: "" });
                setIsLoading(false);
                return; // Show login/register form if not logged in
            }

            setIsLoggedIn(true);
            const response = await axios.get("http://192.168.68.107:9000/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { user: userData } = response.data;
            setUser({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                mobileNo: userData.mobileNo || "",
            });
            setGetUserId(token); // Sync getUserId with token
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile. Please try again.");
            setIsLoggedIn(false); // Assume not logged in if profile fetch fails
            setUser({ firstName: "", lastName: "", email: "", mobileNo: "" });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Monitor authToken changes only on focus or after login/logout actions
    useEffect(() => {
        fetchUserProfile();

        // Add a focus listener to refetch data when the screen is focused
        const unsubscribeFocus = navigation.addListener("focus", () => {
            console.log("Screen focused, refreshing profile...");
            fetchUserProfile();
        });

        return () => {
            unsubscribeFocus(); // Cleanup focus listener
        };
    }, [fetchUserProfile, navigation]); // Removed getUserId to prevent unnecessary re-renders

    // Handle login form changes
    const handleLoginTextChange = (text: string, fieldName: string) => {
        setUserLoginForm((prev) => ({ ...prev, [fieldName]: text }));
        setLoginError(null); // Clear error on change
    };

    // Handle signup form changes
    const handleSignUpTextChange = (text: string, fieldName: string) => {
        setUserSignupForm((prev) => ({ ...prev, [fieldName]: text }));
        setRegistrationError(null); // Clear error on change
    };

    // Validate login form
    const validateLogin = () => {
        if (!userLoginForm.email.trim()) return "Email is required.";
        if (!userLoginForm.password.trim()) return "Password is required.";
        return null;
    };

    // Validate signup form
    const validateSignup = () => {
        if (!userSignupForm.firstName.trim()) return "First name is required.";
        if (!userSignupForm.lastName.trim()) return "Last name is required.";
        if (!userSignupForm.email.trim()) return "Email is required.";
        if (!userSignupForm.mobileNo.trim()) return "Mobile number is required.";
        if (!userSignupForm.password.trim()) return "Password is required.";
        if (userSignupForm.password !== userSignupForm.confirmPassword)
            return "Passwords do not match.";
        return null;
    };

    // Submit login form
    const submitUserLoginForm = async () => {
        const validationError = validateLogin();
        if (validationError) {
            setLoginError(validationError);
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);
        setLoginError(null);
        console.log("Submitting login form...");

        try {
            const response = await axios.post("http://192.168.68.107:9000/user/loginUser", userLoginForm);
            const token = response.data.token;
            await AsyncStorage.setItem("authToken", token);
            setGetUserId(token);
            Alert.alert("Login Successfully!");
            setIsLoggedIn(true); // Update state to show profile
            setUserLoginForm({ email: "", password: "" });
            fetchUserProfile(); // Refresh state to reflect login
        } catch (err) {
            console.error("Login error:", err);
            setLoginError("Invalid email or password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Submit registration form
    const submitRegistrationForm = async () => {
        const validationError = validateSignup();
        if (validationError) {
            setRegistrationError(validationError);
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);
        setRegistrationError(null);
        console.log("Submitting registration form...");

        try {
            const response = await axios.post("http://192.168.68.107:9000/user/registerUser", userSignupForm);
            Alert.alert("User Registration Completed Successfully");
            setShowRegistrationScreen(false); // Ensure this state is updated

            // Automatically log in after registration
            const loginResponse = await axios.post("http://192.168.68.107:9000/user/loginUser", {
                email: userSignupForm.email,
                password: userSignupForm.password,
            });
            const token = loginResponse.data.token;
            await AsyncStorage.setItem("authToken", token);
            setGetUserId(token);
            setIsLoggedIn(true); // Update state to show profile
            setUserSignupForm({
                firstName: "",
                lastName: "",
                email: "",
                mobileNo: "",
                password: "",
                confirmPassword: "",
            });
            fetchUserProfile(); // Refresh state to reflect registration and login
        } catch (err) {
            console.error("Registration error:", err);
            setRegistrationError("Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("authToken");
            setIsLoggedIn(false); // Update state to show login form
            setUser({ firstName: "", lastName: "", email: "", mobileNo: "" });
            setShowRegistrationScreen(false); // Reset to login screen after logout
            setGetUserId(""); // Clear getUserId
            Alert.alert("Logged out successfully!");
            fetchUserProfile(); // Refresh state to reflect logout
        } catch (err) {
            console.error("Error logging out:", err);
            Alert.alert("Logout Error", "Failed to log out. Please try again.");
        }
    };

    const navigateToUpdateProfile = () => {
        navigation.navigate("UpdateProfile"); // Navigate to UpdateProfileScreen
    };

    const navigateToCreateProduct = () => {
        navigation.navigate("CreateProduct");
    };

    const navigateToCreateCategory = () => {
        navigation.navigate("CreateCategory");
    };

    const navigateToFavorites = () => {
        navigation.navigate("FavoriteProduct");
    };

    const handleKeyboardDismiss = () => {
        Keyboard.dismiss();
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={fetchUserProfile}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeadersComponent
                pageTitle={isLoggedIn ? "Profile" : "User Authentication"}
                goToPrevious={() => navigation.goBack()}
            />
            {isLoggedIn ? (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        {/* Username at the top */}
                        <View style={styles.header}>
                            <Text style={styles.username}>{`${user.firstName} ${user.lastName}`.trim() || "User"}</Text>
                        </View>

                        {/* Navigation Tiles */}
                        <View style={styles.tilesContainer}>
                            <Pressable style={styles.tile} onPress={navigateToUpdateProfile}>
                                <Ionicons name="person-outline" size={24} color="#007AFF" />
                                <Text style={styles.tileText}>Update Profile</Text>
                            </Pressable>

                            <Pressable style={styles.tile} onPress={navigateToCreateProduct}>
                                <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                                <Text style={styles.tileText}>Create Product</Text>
                            </Pressable>

                            <Pressable style={styles.tile} onPress={navigateToCreateCategory}>
                                <Ionicons name="folder-outline" size={24} color="#007AFF" />
                                <Text style={styles.tileText}>Create Category</Text>
                            </Pressable>

                            <Pressable style={styles.tile} onPress={navigateToFavorites}>
                                <Ionicons name="heart-outline" size={24} color="#007AFF" />
                                <Text style={styles.tileText}>Favorite Products</Text>
                            </Pressable>
                        </View>

                        <Pressable style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            ) : (
                <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.authScrollContent}>
                            <View style={styles.authHeader}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: "bold",
                                        marginTop: 12,
                                        color: "#041E42",
                                    }}
                                >
                                    {!showRegistrationScreen ? "Login to your Account" : "Register a New Account"}
                                </Text>
                            </View>
                            {showRegistrationScreen ? (
                                <View style={styles.formContainer}>
                                    <UserDataForm
                                        label="Enter Your FirstName"
                                        labelColor="black"
                                        duration={300}
                                        text={userSignupForm.firstName}
                                        updateText={(text: string) => handleSignUpTextChange(text, "firstName")}
                                    />
                                    <UserDataForm
                                        label="Enter Your LastName"
                                        labelColor="black"
                                        duration={300}
                                        text={userSignupForm.lastName}
                                        updateText={(text: string) => handleSignUpTextChange(text, "lastName")}
                                    />
                                    <UserDataForm
                                        label="Enter Your Email"
                                        labelColor="black"
                                        duration={300}
                                        text={userSignupForm.email}
                                        updateText={(text: string) => handleSignUpTextChange(text, "email")}
                                    />
                                    <UserDataForm
                                        label="Enter Your Mobile Number"
                                        labelColor="black"
                                        duration={300}
                                        text={userSignupForm.mobileNo}
                                        updateText={(text: string) => handleSignUpTextChange(text, "mobileNo")}
                                    />
                                    <UserDataForm
                                        label="Enter Your Password"
                                        labelColor="black"
                                        duration={300}
                                        text={userSignupForm.password}
                                        updateText={(text: string) => handleSignUpTextChange(text, "password")}
                                    />
                                    <UserDataForm
                                        label="Confirm Your Password"
                                        labelColor="black"
                                        duration={300}
                                        text={userSignupForm.confirmPassword}
                                        updateText={(text: string) => handleSignUpTextChange(text, "confirmPassword")}
                                    />
                                    {registrationError && (
                                        <Text style={styles.errorText}>{registrationError}</Text>
                                    )}
                                    <Pressable
                                        style={[styles.authButton, isSubmitting && styles.disabledButton]}
                                        onPress={submitRegistrationForm}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.authButtonText}>Register</Text>
                                        )}
                                    </Pressable>
                                </View>
                            ) : (
                                <View style={styles.formContainer}>
                                    <UserDataForm
                                        label="Enter Your Email"
                                        labelColor="black"
                                        duration={300}
                                        text={userLoginForm.email}
                                        updateText={(text: string) => handleLoginTextChange(text, "email")}
                                    />
                                    <UserDataForm
                                        label="Enter Your Password"
                                        labelColor="black"
                                        duration={300}
                                        text={userLoginForm.password}
                                        updateText={(text: string) => handleLoginTextChange(text, "password")}
                                    />
                                    {loginError && (
                                        <Text style={styles.errorText}>{loginError}</Text>
                                    )}
                                    <Pressable
                                        style={[styles.authButton, isSubmitting && styles.disabledButton]}
                                        onPress={submitUserLoginForm}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.authButtonText}>Login</Text>
                                        )}
                                    </Pressable>
                                </View>
                            )}
                            <Pressable
                                style={styles.toggleAuthButton}
                                onPress={() => setShowRegistrationScreen(!showRegistrationScreen)}
                            >
                                <Text style={styles.toggleAuthText}>
                                    {showRegistrationScreen
                                        ? "Already have an account? Login"
                                        : "Don't have an account? Sign Up"}
                                </Text>
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 0 : 0,
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 30,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        alignItems: "center",
    },
    username: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#041E42",
    },
    tilesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingVertical: 20,
        backgroundColor: "#FFFFFF",
        marginBottom: 15,
    },
    tile: {
        width: 90, // Square tiles
        height: 90,
        backgroundColor: "#F0F0F0",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tileText: {
        fontSize: 12,
        color: "#333",
        marginTop: 5,
        textAlign: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FF0000",
        marginTop: 10,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#FF2D55",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: "center",
        marginHorizontal: 15,
        marginTop: 20,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
    },
    authContainer: {
        flex: 1,
    },
    authScrollContent: {
        paddingVertical: 20,
        alignItems: "center",
    },
    authHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    formContainer: {
        width: "80%", // Center and limit form width for consistency
        padding: 10,
    },
    authButton: {
        width: 200,
        backgroundColor: "#febe10",
        borderRadius: 6,
        padding: 15,
        marginTop: 20,
        marginLeft: 50,
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    authButtonText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    toggleAuthButton: {
        marginTop: 15,
        marginBottom: 15, // Ensure showRegistrationScreen is used here
    },
    toggleAuthText: {
        textAlign: "center",
        color: "grey",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProfileScreen;