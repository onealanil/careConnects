import Toast from 'react-native-toast-message';

export const ErrorToast = (error) => {
  return Toast.show({
    type: 'error',
    text1: error,
  });
};
