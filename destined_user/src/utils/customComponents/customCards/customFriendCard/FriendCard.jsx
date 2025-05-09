import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../../../styles/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('screen');

const FriendCard = ({name, age, image, totalMedia, onPress}) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scaleIn = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleIn, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{scale: scaleIn}],
            opacity: fadeIn,
          },
        ]}>
        <Image source={image} style={styles.backgroundImage} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={StyleSheet.absoluteFill}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>

          <View style={styles.ageContainer}>
            <Text style={styles.age}>{age}</Text>
            <View style={styles.ageDecoration} />
          </View>
        </View>

        <View style={styles.mediaContainer}>
          <FontAwesome
            name="photo"
            size={width * 0.04}
            color={theme.colors.white}
          />
          <Text style={styles.mediaText}>{totalMedia}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.46,
    height: height * 0.26,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 12},
    shadowRadius: 20,
    elevation: 5,
    margin: height * 0.012,
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },

  infoContainer: {
    position: 'absolute',
    bottom: height * 0.04,
    left: width * 0.04,
  },

  name: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyBold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    maxWidth: width * 0.36,
    lineHeight: theme.typography.lineHeight.md,
  },

  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.005,
  },

  age: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilySemiBold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  ageDecoration: {
    width: width * 0.05,
    height: 1,
    backgroundColor: theme.colors.white,
    marginLeft: width * 0.02,
    opacity: 0.7,
  },

  mediaContainer: {
    position: 'absolute',
    bottom: height * 0.02,
    right: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    borderRadius: theme.borderRadius.medium,
  },

  mediaText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilySemiBold,
    marginLeft: width * 0.01,
  },
});
