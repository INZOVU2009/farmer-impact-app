import React, { useState } from "react";
import { colors } from "../../data/colors";
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import { FarmerCard } from "../../components/FarmerCard";

export const FarmerScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("Homepage");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg_variant_x,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: screenHeight * 0.11,
          backgroundColor: colors.bg_variant_x,
          paddingTop: screenHeight * 0.042,
          padding: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            padding: 5,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
            marginLeft: screenWidth * 0.12,
          }}
        >
          Registered ATP Farmer
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          gap: 10,
          width: screenWidth,
          padding: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: screenHeight * 0.1,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              height: "55%",
              padding: 8,
              elevation: 6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Group 1</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              marginVertical: 12,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 15,
              width: "80%",
              elevation: 6,
            }}
          >
            <AntDesign name="search1" size={24} color={colors.black_a} />
            <Formik
              initialValues={{
                uname: "",
                password: "",
              }}
              onSubmit={async (values) => {
                dispatch(
                  login({
                    Name_User: values.uname,
                    password: values.password,
                  })
                );
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{ width: "80%" }}>
                  <TextInput
                    placeholderTextColor={colors.black_a}
                    onChangeText={handleChange}
                    onBlur={handleBlur}
                    value={values.uname}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      fontWeight: "700",
                      fontSize: screenWidth * 0.05,
                      color: colors.blue_font,
                    }}
                  />
                </View>
              )}
            </Formik>
            <Feather name="x" size={24} color={colors.black_a} />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "white",
            borderRadius: 15,
            padding: 8,
            elevation: 6,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 5,
              gap: 15,
            }}
          >
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
            <FarmerCard
              data={{ id: "F40746A", name: "Karake Eric", date_birth: "1983" }}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
