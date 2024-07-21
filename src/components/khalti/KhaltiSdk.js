import React from 'react';
import { View, Modal, SafeAreaView, Text } from 'react-native';
import KhaltiWebView from './KhaltiWebView';
import CloseIcon from './CloseIcon';
import { styles } from './styles';

export const KhaltiSdk = ({
  amount,
  publicKey,
  isVisible,
  productUrl,
  productName,
  productIdentity,
  onPaymentComplete,
  paymentPreference,
  onClose,
  dark = false,
}) => (
  <Modal
    visible={isVisible}
    animationType="slide"
  >
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.wrapper}>
          <CloseIcon onClose={onClose} dark={dark} />
          <KhaltiWebView
            amount={amount}
            publicKey={publicKey}
            productUrl={productUrl}
            productName={productName}
            callback={onPaymentComplete}
            productIdentity={productIdentity}
            paymentPreference={paymentPreference}
          />
        </View>
      </SafeAreaView>
    </View>
  </Modal>
);

export default KhaltiSdk;