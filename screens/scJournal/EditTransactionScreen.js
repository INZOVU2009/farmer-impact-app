import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../components/BuyCoffeeInput";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { updateDBdataAsync } from "../../helpers/updateDBdataAsync";
import { validateTransaction } from "../../helpers/validateTransaction";

export const EditTransactionScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { data } = route.params;

  const [currentCertificationType, setCurrentCertificationType] =
    useState("Cafe Practices");
  const [currentCoffeeType, setCurrentCoffeeType] = useState("Cherry");
  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });
  const [transValidated, setTransValidate] = useState(false);

  const [currentTransactionData, setcurrentTransactionData] = useState({});
  const [updateQuery, setUpdateQuery] = useState("");

  const [displayDate, setDisplayDate] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setDisplayDate(
      date.toLocaleString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  };

  const handleBackButton = () => {
    navigation.replace("ScDailySummary", { data });
  };

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const validateInputs = (values) => {
    if (
      !values.certificationType ||
      values.certificationType === "" ||
      !values.coffeeType ||
      values.coffeeType === "" ||
      !values.cashTotal ||
      values.cashTotal === "" ||
      values.cashTotalMobile === ""
    ) {
      setValidationError({
        type: "emptyOrInvalidData",
        message: "Invalid inputs detected",
        inputBox: null,
      });
      setCurrentJob("Invalid inputs detected");
      return false;
    }

    return true;
  };

  const submitTransaction = async (transactionData) => {
    try {
      let editedData = {
        coffee_type: currentCoffeeType,
        kilograms: transactionData.kgGood,
        unitprice: transactionData.priceGood,
        certification: currentCertificationType,
        certified:
          transactionData.certificationType === "not certified" ? 0 : 1,
        edited: 1,
        cash_paid: transactionData.cashTotal,
        total_mobile_money_payment: transactionData.cashTotalMobile,
        bad_unit_price: transactionData.priceBad,
        bad_kilograms: transactionData.kgBad,
      };

      setValidationError({ message: null, type: null });

      if (validateInputs(transactionData)) {
        let query = `UPDATE rtc_transactions SET coffee_type='${editedData.coffee_type}', kilograms=${editedData.kilograms}, unitprice=${editedData.unitprice}, certification='${editedData.certification}', certified=${editedData.certified}, edited=${editedData.edited}, cash_paid=${editedData.cash_paid}, total_mobile_money_payment=${editedData.total_mobile_money_payment}, bad_unit_price=${editedData.bad_unit_price}, bad_kilograms=${editedData.bad_kilograms} WHERE paper_receipt=${data.receiptId}`;

        setUpdateQuery(query);
        validateTransaction({
          farmerid: currentTransactionData.farmerid,
          kgsBad: editedData.bad_kilograms,
          kgsGood: editedData.kilograms,
          setValid: setTransValidate,
          setCurrentJob,
          setError: setValidationError,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (transValidated) {
      updateDBdataAsync({ id: data.receiptId, query: updateQuery })
        .then((result) => {
          if (result.success) {
            setCurrentJob("Transaction updated");
          } else {
            setCurrentJob("Failed to update transaction");
          }
        })
        .catch((error) => {
          setCurrentJob("Failed to update transaction");
          console.log("Failed to update transaction: ", error);
        });
    }
  }, [transValidated]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardActive(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardActive(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isKeyboardActive]);

  useEffect(() => {
    if (currentJob) {
      ToastAndroid.show(currentJob, ToastAndroid.SHORT);
    }
  }, [currentJob]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        let transaction = {};
        retrieveDBdataAsync({
          tableName: "rtc_transactions",
          filterValue: data.receiptId,
          filterCol: "paper_receipt",
        })
          .then((result) => {
            transaction = result[0];
            setcurrentTransactionData(transaction);
            const dateString = result[0].transaction_date;
            const dateObj = new Date(dateString);
            const isoDateString = dateObj.toISOString();
            setDate(isoDateString);
            setCurrentCertificationType(result[0].certification);
            setCurrentCoffeeType(result[0].coffee_type);
            setDisplayDate(
              dateObj.toLocaleString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            );
          })
          .catch((error) => {
            console.log("Error loading data for this transaction: ", error);
            setCurrentJob("loading data for this transaction failed");
          });
      };

      fetchData();
      return () => {
        // Cleanup code if needed
      };
    }, [route.params.data])
  );

  return (
    <View
      style={{
        flex: 1,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: screenHeight * 0.11,
          backgroundColor: colors.white,
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
            marginLeft: screenWidth * 0.21,
          }}
        >
          Edit Transaction
        </Text>
      </View>
      {currentTransactionData.farmerid && (
        <View style={{ backgroundColor: colors.bg_variant }}>
          <Formik
            initialValues={{
              farmerID: currentTransactionData.farmerid,
              farmerName: currentTransactionData.farmername,
              receiptNumber: currentTransactionData.paper_receipt,
              transactionDate: currentTransactionData.transaction_date,
              certificationType: currentTransactionData.certification,
              coffeeType: currentTransactionData.coffee_type,
              kgGood: currentTransactionData.kilograms,
              priceGood: currentTransactionData.unitprice,
              totalGood:
                currentTransactionData.kilograms *
                currentTransactionData.unitprice,
              kgBad: currentTransactionData.bad_kilograms,
              priceBad: currentTransactionData.bad_unit_price,
              totalBad:
                currentTransactionData.bad_kilograms *
                currentTransactionData.bad_unit_price,
              cashTotal: currentTransactionData.cash_paid,
              cashTotalMobile:
                currentTransactionData.total_mobile_money_payment,
            }}
            onSubmit={async (values) => {
              submitTransaction(values);
            }}
          >
            {({
              handleChange,
              setFieldValue,
              handleBlur,
              handleSubmit,
              values,
            }) => (
              <View
                style={{
                  gap: 18,
                }}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    height: "94%",
                  }}
                  contentContainerStyle={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: screenHeight * 0.01,
                    paddingVertical: screenHeight * 0.005,
                  }}
                >
                  <View
                    style={{
                      width: "95%",
                      backgroundColor: colors.white,
                      elevation: 2,
                      borderRadius: 15,
                      marginTop: screenHeight * 0.025,
                      paddingHorizontal: screenWidth * 0.04,
                      paddingVertical: screenHeight * 0.03,
                      gap: screenHeight * 0.01,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.05,
                        color: colors.secondary,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      Confirm Purchase
                    </Text>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("farmerID")}
                      handleBlur={handleBlur("farmerID")}
                      label={"Farmer ID"}
                      value={values.farmerID}
                      active={false}
                    />
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("farmerName")}
                      handleBlur={handleBlur("farmerName")}
                      label={"Farmer Name"}
                      value={values.farmerName}
                      active={false}
                    />
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("receiptNumber")}
                      handleBlur={handleBlur("receiptNumber")}
                      label={"Receipt Number"}
                      value={values.receiptNumber}
                      active={false}
                    />
                    <View
                      style={{
                        gap: screenHeight * 0.01,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "400",
                          fontSize: screenWidth * 0.04,
                          color: colors.black,
                          marginLeft: screenWidth * 0.02,
                        }}
                      >
                        Transaction Date
                      </Text>
                      <View
                        style={{
                          flexDirection: "row-reverse",
                          alignItems: "center",
                          gap: screenWidth * 0.02,
                          width: "100%",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            padding: screenWidth * 0.02,
                            borderRadius: 7,
                            backgroundColor: colors.white_variant,
                            elevation: 4,
                          }}
                          disabled={true}
                          onPress={showDatepicker}
                        >
                          <AntDesign
                            name="calendar"
                            size={screenWidth * 0.06}
                            color="black"
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            borderWidth: 0.3,
                            borderRadius: 8,
                            borderColor: colors.bg_variant_font,
                            backgroundColor: colors.white_a,
                            paddingHorizontal: 7,
                            paddingVertical: 7,
                            width: screenWidth * 0.745,
                            fontWeight: "500",
                            fontSize: screenWidth * 0.05,
                            color: colors.blue_font,
                          }}
                        >
                          {displayDate}
                        </Text>
                        {show && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                          />
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Certification type */}
                  <View
                    style={{
                      width: "95%",
                      backgroundColor: colors.white,
                      elevation: 2,
                      borderRadius: 15,
                      paddingHorizontal: screenWidth * 0.04,
                      paddingVertical: screenHeight * 0.03,
                      gap: screenHeight * 0.01,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.05,
                        color: colors.secondary,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      Certification Type
                    </Text>
                    <RadioButtonGroup
                      containerStyle={{ marginBottom: 10, gap: 5 }}
                      selected={currentCertificationType}
                      onSelected={(value) => setCurrentCertificationType(value)}
                      radioBackground={colors.blue_font}
                    >
                      <RadioButtonItem
                        value="Cafe Practices"
                        label={
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              marginLeft: 8,
                              color: colors.black,
                            }}
                          >
                            Cafe Practices
                          </Text>
                        }
                      />
                      <RadioButtonItem
                        value="Rainforest Alliance"
                        label={
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              marginLeft: 8,
                              color: colors.black,
                            }}
                          >
                            Rainforest Alliance
                          </Text>
                        }
                      />
                      <RadioButtonItem
                        value="not certified"
                        label={
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              marginLeft: 8,
                              color: colors.black,
                            }}
                          >
                            Not Certified
                          </Text>
                        }
                      />
                    </RadioButtonGroup>
                  </View>

                  {/* coffee type */}
                  <View
                    style={{
                      width: "95%",
                      backgroundColor: colors.white,
                      elevation: 2,
                      borderRadius: 15,
                      paddingHorizontal: screenWidth * 0.04,
                      paddingVertical: screenHeight * 0.03,
                      gap: screenHeight * 0.01,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.05,
                        color: colors.secondary,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      Coffee Type
                    </Text>
                    <RadioButtonGroup
                      containerStyle={{ marginBottom: 10, gap: 5 }}
                      selected={currentCoffeeType}
                      onSelected={(value) => setCurrentCoffeeType(value)}
                      radioBackground={colors.blue_font}
                    >
                      <RadioButtonItem
                        value="Cherry"
                        label={
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              marginLeft: 8,
                              color: colors.black,
                            }}
                          >
                            Cherry
                          </Text>
                        }
                      />
                      <RadioButtonItem
                        value="Parchment"
                        label={
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              marginLeft: 8,
                              color: colors.black,
                            }}
                          >
                            Parchment
                          </Text>
                        }
                      />
                    </RadioButtonGroup>
                  </View>

                  {/* quantity */}
                  <View
                    style={{
                      justifyContent: "space-between",
                      width: "95%",
                      backgroundColor: colors.white,
                      elevation: 2,
                      borderRadius: 15,
                      paddingHorizontal: screenWidth * 0.04,
                      paddingVertical: screenHeight * 0.03,
                      rowGap: screenWidth * 0.04,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.05,
                        color: colors.secondary,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      Coffee Quantity
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "48%",
                          gap: screenHeight * 0.01,
                          paddingBottom: screenHeight * 0.03,
                        }}
                      >
                        <BuyCoffeeInput
                          values={values}
                          handleChange={(text) => {
                            handleChange("kgGood")(text);
                            let input = parseFloat(text) || 0;
                            let totalPrice =
                              input * parseFloat(values.priceGood) || 0;

                            setFieldValue("totalGood", totalPrice);

                            let totalCash =
                              parseFloat(totalPrice) +
                              parseFloat(+values.totalBad);
                            setFieldValue("cashTotal", totalCash.toFixed(2));
                          }}
                          handleBlur={handleBlur("kgGood")}
                          label={"Kgs(Good)"}
                          radius={4}
                          value={values.kgGood.toString()}
                        />
                        <View
                          style={{
                            backgroundColor: colors.bg_variant_font,
                            height: "0.5%",
                            width: "100%",
                            marginVertical: screenHeight * 0.008,
                          }}
                        />
                        <BuyCoffeeInput
                          values={values}
                          handleChange={(text) => {
                            handleChange("kgBad")(text);
                            let input = parseFloat(text) || 0;
                            let totalPrice =
                              input * parseFloat(values.priceBad) || 0;

                            setFieldValue("totalBad", totalPrice);

                            let totalCash =
                              parseFloat(totalPrice) +
                              parseFloat(+values.totalGood);
                            setFieldValue("cashTotal", totalCash.toFixed(2));
                          }}
                          handleBlur={handleBlur("kgBad")}
                          label={"Kgs(Bad)"}
                          radius={4}
                          value={values.kgBad.toString()}
                        />
                      </View>
                      <View
                        style={{
                          width: "48%",
                          gap: screenHeight * 0.01,
                          paddingBottom: screenHeight * 0.03,
                        }}
                      >
                        <BuyCoffeeInput
                          values={values}
                          handleChange={(text) => {
                            handleChange("priceGood")(text);
                            let input = parseFloat(text) || 0;
                            let totalPrice =
                              input * parseFloat(values.kgGood) || 0;

                            setFieldValue("totalGood", totalPrice);

                            let totalCash =
                              parseFloat(totalPrice) +
                              parseFloat(+values.totalBad);

                            setFieldValue("cashTotal", totalCash.toFixed(2));
                          }}
                          handleBlur={handleBlur("priceGood")}
                          label={"Price/Kg"}
                          radius={4}
                          value={values.priceGood.toString()}
                        />
                        <View
                          style={{
                            backgroundColor: colors.bg_variant_font,
                            height: "0.5%",
                            width: "100%",
                            marginVertical: screenHeight * 0.008,
                          }}
                        />
                        <BuyCoffeeInput
                          values={values}
                          handleChange={(text) => {
                            handleChange("priceBad")(text);
                            let input = parseFloat(text) || 0;
                            let totalPrice =
                              input * parseFloat(values.kgBad) || 0;

                            setFieldValue("totalBad", totalPrice);
                            let totalCash =
                              parseFloat(totalPrice) +
                              parseFloat(+values.totalGood);

                            setFieldValue("cashTotal", totalCash.toFixed(2));
                          }}
                          handleBlur={handleBlur("priceBad")}
                          label={"Price/Kg"}
                          radius={4}
                          value={values.priceBad.toString()}
                        />
                      </View>
                    </View>
                  </View>

                  {/* coffee value */}
                  <View
                    style={{
                      width: "95%",
                      backgroundColor: colors.white,
                      elevation: 2,
                      borderRadius: 15,
                      paddingHorizontal: screenWidth * 0.04,
                      paddingVertical: screenHeight * 0.03,
                      gap: screenHeight * 0.01,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.05,
                        color: colors.secondary,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      Coffee Value
                    </Text>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("cashTotal")}
                      handleBlur={handleBlur("cashTotal")}
                      label={"Total Cash Paid"}
                      radius={4}
                      active={false}
                      value={values.cashTotal.toString()}
                    />
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("cashTotalMobile")}
                      handleBlur={handleBlur("cashTotalMobile")}
                      label={"Total Paid By Mobile Payment"}
                      radius={4}
                      value={values.cashTotalMobile.toString()}
                    />
                  </View>

                  {/* validation error */}
                  {validationError.message && (
                    <View
                      style={{
                        width: "95%",
                        backgroundColor: colors.white_variant,
                        elevation: 2,
                        borderWidth: 0.7,
                        borderColor: "red",
                        borderRadius: 15,
                        paddingHorizontal: screenWidth * 0.04,
                        paddingVertical: screenHeight * 0.03,
                        gap: screenHeight * 0.01,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "400",
                          fontSize: screenWidth * 0.05,
                          color: colors.secondary,
                          marginLeft: screenWidth * 0.02,
                        }}
                      >
                        Validation Error
                      </Text>
                      <Text
                        style={{
                          fontWeight: "400",
                          fontSize: screenWidth * 0.04,
                          color: colors.black_letter,
                          marginLeft: screenWidth * 0.02,
                        }}
                      >
                        {validationError.message}
                      </Text>
                    </View>
                  )}
                  <CustomButton
                    bg={colors.secondary}
                    color={"white"}
                    width="95%"
                    text="Update"
                    bdcolor="transparent"
                    mt={screenHeight * 0.017}
                    mb={
                      isKeyboardActive
                        ? screenHeight * 0.04
                        : screenHeight * 0.03
                    }
                    radius={10}
                    disabled={indicatorVisible}
                    onPress={handleSubmit}
                  />
                </ScrollView>
              </View>
            )}
          </Formik>
        </View>
      )}
    </View>
  );
};
