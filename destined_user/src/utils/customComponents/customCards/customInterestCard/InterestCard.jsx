import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {theme} from '../../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const InterestCard = ({interestName, iconSource, isSelected}) => {
  return (
    <View style={[styles.cardContainer, isSelected && styles.selectedCard]}>
      {/* <Image source={iconSource} style={styles.interestIcon} /> */}
      <Text style={styles.interestName}>{interestName}</Text>
    </View>
  );
};

export default InterestCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.44,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.circle,
    paddingVertical: height * 0.02,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.01,
    borderWidth: 2,
    borderColor: theme.colors.white,
    // flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },

  //   interestIcon: {
  //     width: width * 0.04,
  //     height: width * 0.04,
  //     marginRight: width * 0.04,
  //     tintColor: theme.colors.primary,
  //   },

  interestName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamilySemiBold,
    textAlign: 'center',
  },
});
