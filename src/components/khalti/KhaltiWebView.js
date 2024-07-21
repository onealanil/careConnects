import React from 'react';
import Webview from './Webview';
import { getKhaltiHTML } from './htmlGenerator';

const KhaltiWebView = ({
  amount,
  callback,
  publicKey,
  productUrl,
  productName,
  productIdentity,
  paymentPreference,
}) => (
  <Webview
    source={{
      html: getKhaltiHTML({
        amount,
        publicKey,
        productUrl,
        productName,
        productIdentity,
        paymentPreference,
      })
    }}
    onMessage={(event) => {
      const data = JSON.parse(event.nativeEvent.data);
      callback(data);
    }}
  />
);

export default KhaltiWebView;