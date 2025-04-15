import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const SuccessScreen = ({title, subTitle}) => {
  return (
    <LinearGradient
      colors={[theme.colors.primaryLight, theme.colors.primary]}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <View style={styles.content}>
        <LottieView
          source={require('../../../assets/animations/success.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subTitle}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.primaryDark,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  confetti: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: -1,
  },
  detailsContainer: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.dark,
  },
  detailValue: {
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.grayDark,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilySemiBold,
    fontSize: 16,
  },
});

export default SuccessScreen;
