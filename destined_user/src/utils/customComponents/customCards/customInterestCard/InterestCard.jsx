import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {theme} from '../../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const InterestCard = ({interestName, isSelected}) => {
  return (
    <View style={[styles.cardContainer, isSelected && styles.selectedCard]}>
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  selectedCard: {
    borderWidth: 4,
    borderColor: '#ff33cc',
    backgroundColor: theme.colors.white,
    shadowColor: '#ff66ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  interestName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamilySemiBold,
    textAlign: 'center',
  },
});
