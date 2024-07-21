import React from 'react';
import { Pressable, Image } from 'react-native';
import { styles } from './styles';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const CloseIcon = React.memo(({ onClose, dark = false }) => (
  <Pressable style={styles.iconContainer} onPress={onClose}>
    <Image source={require('../../../assets/cross.png')} style={{
      marginTop: responsiveHeight(5),
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: dark ? '#000' : 'white'
    }} />
  </Pressable>
));

export default CloseIcon;