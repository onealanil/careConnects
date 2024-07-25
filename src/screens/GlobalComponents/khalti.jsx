import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import KhaltiSdk from "../../components/khalti/KhaltiSdk";
import { BACKEND_URL } from "../../global/config";
import axios from "axios";
import { SuccessToast } from "../../components/SuccessToast";
import { ErrorToast } from "../../components/ErrorToast";
import { useGlobalStore } from "../../global/store";
import { KhaltiStore } from "./helper/KhaltiStore";

const Khalti = ({
  isVisible,
  setIsVisible,
  getAllCareGiver,
  khaltiNumber,
  datas,
}) => {
  const { user } = useGlobalStore();
  const navigation = useNavigation();

  const updateJobStatus = async () => {
    try {
      const response = await KhaltiStore.getState().clearWorkingStatus();
      getAllCareGiver();
      SuccessToast("Working status updated successfully");
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
  };

  //assigned by --> mero id

  const createPayment = async (paymentBy, paymentTo, amount, khaltiNumber) => {
    try {
      await KhaltiStore.getState().createPayment(
        paymentBy,
        paymentTo,
        amount,
        khaltiNumber
      );
      SuccessToast("Payment created successfully");
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
  };

  const _onPaymentComplete = async (data) => {
    setIsVisible(false);
    const str = data.data;
    console.log(str, "this is str");
    // console.log({ resp })
    if (data.event === "CLOSED") {
      // handle closed action
    } else if (data.event === "SUCCESS") {
      const token = str.token;
      const amount = str.amount;
      const response = await axios.post(`${BACKEND_URL}/charge`, {
        token: token,
        amount: amount,
      });
      if (response.data.status === "success") {
        createPayment(user?._id, datas?._id, 20, khaltiNumber);
        console.log(response.data);
        updateJobStatus();
        setIsVisible(false);
        SuccessToast("Payment Successful");
      } else if (data.event === "ERROR") {
        ErrorToast("Payment Failed");
      }
      return;
    }
  };

  return (
    <SafeAreaView>
      <KhaltiSdk
        amount={10 * 100} // Number in paisa
        isVisible={isVisible}
        paymentPreference={[
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ]}
        productName={"Dragon"}
        productIdentity={"1234567890"}
        onPaymentComplete={_onPaymentComplete}
        productUrl={"http://gameofthrones.wikia.com/wiki/Dragons"}
        publicKey={"test_public_key_78b45fa5c8ba4dc5a6ced499c3b24a2e"}
        onClose={() => {
          setIsVisible(false);
          navigation.navigate("Payment");
        }}
      />
    </SafeAreaView>
  );
};

export default Khalti;
