import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import KhaltiSdk from "../../components/khalti/KhaltiSdk";

const Khalti = ({ isVisible, setIsVisible }) => {
  const navigation = useNavigation();

  const _onPaymentComplete = (data) => {
    setIsVisible(false);
    const str = data.data;
    console.log(str, "this is str");
    // console.log({ resp })
    if (data.event === "CLOSED") {
      // handle closed action
    } else if (data.event === "SUCCESS") {
      // console.log({ data: resp.data })
      const token = str.token;
      const amount = str.amount;
      console.log({ token, amount }, "this is token and amount");
    } else if (data.event === "ERROR") {
      // console.log({ error: resp.data })
    }
    return;
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
