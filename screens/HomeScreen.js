import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../data/colors";
import { Entypo } from "@expo/vector-icons";
import hamburger_IMG from "../assets/hamburger_menu.png";
import avatar_IMG from "../assets/avatar.png";
import home_IMG from "../assets/home_banner.jpg";
import { OpCard } from "../components/OpCard";
import { SideBar } from "../components/SideBar";
import { useSelector } from "react-redux";
import { sidebarActions } from "../redux/SidebarSlice";

export const HomeScreen = ({ navigation }) => {
  const sidebar = useSelector((state) => state.sidebar);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const handleClick = () => {
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    setIsSidebarOpen(sidebar.sidebarStatus);
  }, [sidebar.sidebarStatus]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.white,
      }}
      on
    >
      <StatusBar style={isSidebarOpen ? "light" : "dark"} />
      <View
        style={{
          flex: 1,
          marginTop: screenHeight * 0.04,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: screenHeight * 0.11,
            backgroundColor: colors.white,
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={handleClick}>
            <Image
              source={hamburger_IMG}
              resizeMode="cover"
              style={{
                height: 50,
                width: 50,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "900",
                fontSize: 24,
                color: colors.secondary_variant,
              }}
            >
              Hello User
            </Text>
            <Text style={{ fontSize: 13 }}>Sunday, 27 February 2024</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={avatar_IMG}
              resizeMode="cover"
              style={{
                height: 35,
                width: 35,
                borderWidth: 1,
                borderColor: colors.black,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: screenHeight * 0.3,
            borderBottomLeftRadius: 55,
            overflow: "hidden",
            ...Platform.select({
              ios: {
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
              },
              android: {
                elevation: 8,
              },
            }),
          }}
        >
          <ImageBackground
            source={home_IMG}
            resizeMode="cover"
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                flexDirection: "row",
                padding: 10,
              }}
            >
              <Entypo name="location-pin" size={24} color="white" />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: colors.white,
                  textShadowColor: colors.black,
                  textShadowOffset: { width: 0, height: 2.5 },
                  textShadowRadius: 5,
                }}
              >
                Gakenke, Station 7
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            columnGap: 8,
            rowGap: 15,
            backgroundColor: colors.bg_variant,
            marginTop: screenHeight * 0.025,
            borderTopRightRadius: 55,
            ...Platform.select({
              ios: {
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
              },
              android: {
                elevation: 8,
              },
            }),
            padding: 20,
          }}
        >
          <OpCard name={"Register"} />
          <OpCard name={"Inspection"} />
          <OpCard name={"Update Farmer"} />
          <OpCard name={"Training"} />
          <OpCard name={"Buy Coffee"} />
          <OpCard name={"Review Purchases"} />
          <OpCard name={"CWS Finance"} />
          <OpCard name={"Wet Mill Audit"} />
        </View>
      </View>
      {isSidebarOpen && <SideBar />}
    </View>
  );
};