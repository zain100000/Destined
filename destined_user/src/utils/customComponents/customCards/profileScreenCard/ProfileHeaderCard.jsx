import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import {globalStyles} from '../../../../styles/globalStyles';
import Button from '../../customButton/Button';
import {theme} from '../../../../styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import imgPlaceHolder from '../../../../assets/placeholders/default-avatar.png';

const {width, height} = Dimensions.get('screen');

const ProfileHeaderCard = ({
  image,
  name,
  phone,
  btnTitle,
  onPress,
  loading,
}) => {
  return (
    <SafeAreaView style={[globalStyles.container, styles.primaryContainer]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.white]}
        style={styles.gradientContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.imgContainer}>
            {image ? (
              <Image source={{uri: image}} style={styles.img} />
            ) : (
              <Image source={imgPlaceHolder} style={styles.img} />
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.phone}>{phone}</Text>
          </View>
          <View style={styles.btnContainer}>
            <Button
              title={btnTitle}
              onPress={onPress}
              loading={loading}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProfileHeaderCard;

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: theme.borderRadius.large,
    marginHorizontal: width * 0.02,
    shadowColor: theme.colors.dark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },

  cardContainer: {
    padding: height * 0.014,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.white + '90',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.gap(0.1),
  },

  imgContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: theme.borderRadius.circle,
    overflow: 'hidden',
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  infoContainer: {
    top: height * 0.012,
    flex: 1,
    maxWidth: width * 0.4,
  },

  name: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    left: width * 0.04,
    color: theme.colors.dark,
    flexWrap: 'wrap',
    flexShrink: 1,
  },

  phone: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.secondary,
    marginBottom: height * 0.03,
    left: width * 0.04,
  },

  btnContainer:{
    right: width * 0.04
  }
});
