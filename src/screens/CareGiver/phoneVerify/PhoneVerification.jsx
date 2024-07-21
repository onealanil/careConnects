import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useState, useRef} from 'react';
import {RouteProp} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import {ErrorToast} from '../../../components/ErrorToast';
import axios from 'axios';
// import {UserStore} from '../helper/UserStore';
import {SuccessToast} from '../../../components/SuccessToast';
import {useGlobalStore} from '../../../global/store';


const PhoneVerification = ({navigation, route}) => {
  const {user, checkAuth} = useGlobalStore();
  const [value, setValue] = useState(user?.phoneNumber || '');
  const [formattedValue, setFormattedValue] = useState('');
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const phoneInput = useRef(null);

  const updatePhoneDatabase = async () => {};

  // const updatePhoneDatabase = async () => {
  //   setIsVerifyLoading(true);
  //   try {
  //     const responsePhone = await (
  //       UserStore.getState() as any
  //     ).updatePhoneNumber(value);
  //     if (responsePhone) {
  //       checkAuth();
  //       SuccessToast('Phone number added successfully');
  //       navigation.navigate('My_Profile');
  //     }
  //   } catch (error: any) {
  //     ErrorToast(error.message);
  //   }
  //   setIsVerifyLoading(false);
  // };

  const checkForValidation = async (countrycode) => {
    if (value === '') {
      ErrorToast('Please enter a phone number');
      return;
    }
    const options = {
      method: 'GET',
      url: 'https://phonenumbervalidatefree.p.rapidapi.com/ts_PhoneNumberValidateTest.jsp',
      params: {
        number: formattedValue,
        country: countrycode,
      },
      headers: {
        'X-RapidAPI-Key': '6ad617a4e9mshbf68e80b72d0afep1fc0a5jsn412d88e1c12d',
        'X-RapidAPI-Host': 'phonenumbervalidatefree.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(options);
      if (response?.data.E164Format !== 'Invalid') {
        updatePhoneDatabase();
        console.log("itsokay");
      } else {
        ErrorToast('Invalid Number');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhoneVerification = () => {
    const checkValid = phoneInput.current?.isValidNumber(value);
    const countryCode = phoneInput.current?.getCountryCode();
    if (!checkValid) {
      ErrorToast('Invalid phone number');
      return;
    }
    checkForValidation(countryCode);
  };

  return (
    <View style={{marginTop: responsiveHeight(5), backgroundColor: "white"}}>
      <ScrollView
        className="bg-white"
        style={{paddingBottom: responsiveHeight(50)}}>
        <View
          className="w-[100%] flex flex-col"
          style={{padding: responsiveHeight(2)}}>
          {/* back button and text */}
          <View className="mb-2 flex flex-row items-center gap-x-8">
            <TouchableOpacity onPress={() => navigation.navigate('myProfile')}>
              <IconIcons name="arrow-back" size={30} color="gray" />
            </TouchableOpacity>
            <Text
              className="text-gray-500"
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveHeight(2),
              }}>
              Verify your phone number
            </Text>
          </View>
          {/* Other field */}
          <View
            className="w-[90%] flex flex-col items-center justify-center gap-y-10"
            style={{
              marginTop: responsiveHeight(1),
            }}>
            {/* logo  */}
            <View>
              <Image
                source={require('../../../../assets/logo.png')}
                style={{
                  width: responsiveWidth(60),
                  height: responsiveHeight(25),
                }}
              />
            </View>
          </View>
          <View
            className="ml-3"
            style={{
              marginTop: responsiveHeight(5),
            }}>
            {/* text start  */}
            <Text
              className="text-black"
              style={{
                paddingVertical: responsiveHeight(1.75),
                paddingHorizontal: responsiveWidth(2),
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveHeight(2),
              }}>
              Enter a phone number
            </Text>
          </View>
          <View
            className="flex flex-col items-center justify-center gap-y-10 w-[100%]"
            style={{
              marginTop: responsiveHeight(1),
            }}>
            {/* text end */}
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="NP"
              layout="first"
              onChangeText={text => {
                setValue(text);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
              }}
              withDarkTheme
              withShadow
              autoFocus
            />

            <View className="w-[100%] bg-black flex items-center justify-center rounded-md">
              <TouchableOpacity onPress={handlePhoneVerification}>
                <Text
                  className="text-white tracking-widest"
                  style={{
                    paddingVertical: responsiveHeight(1.75),
                    paddingHorizontal: responsiveWidth(2),
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(2.25),
                  }}>
                  {isVerifyLoading ? 'Verifying...' : 'Verify'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PhoneVerification;
