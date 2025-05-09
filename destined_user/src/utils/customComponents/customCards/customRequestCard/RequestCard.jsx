import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {theme} from '../../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const RequestCard = ({request, onAccept, onDelete}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const {profilePicture, name} = request.sender;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{scale: scaleAnim}],
        },
      ]}>
      <View style={styles.leftContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: profilePicture || 'https://via.placeholder.com/80'}}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.btnContainer}>
          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={onAccept}
              style={[styles.actionButton, styles.acceptButton]}
              activeOpacity={0.9}>
              <Ionicons
                name="checkmark"
                size={width * 0.06}
                color={theme.colors.white}
              />
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={onDelete}
              style={[styles.actionButton, styles.deleteButton]}
              activeOpacity={0.7}>
              <Ionicons
                name="close"
                size={width * 0.06}
                color={theme.colors.white}
              />
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

export default RequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    padding: height * 0.02,
    marginHorizontal: width * 0.024,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },

  leftContainer: {
    marginRight: width * 0.04,
  },

  rightContainer: {
    flex: 1,
    flexDirection: 'column',
    right: width * 0.04,
    top: height * 0.01,
  },

  imgContainer: {
    marginBottom: height * 0.04,
    alignSelf: 'center',
  },

  image: {
    width: width * 0.24,
    height: width * 0.24,
    borderRadius: (width * 0.4) / 2,
    resizeMode: 'cover',
  },

  nameContainer: {
    marginBottom: height * 0.014,
    left: width * 0.064,
  },

  name: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.dark,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: width * 0.04,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: theme.borderRadius.medium,
    marginLeft: width * 0.024,
  },

  acceptButton: {
    backgroundColor: '#4CAF50',
  },

  deleteButton: {
    backgroundColor: '#F44336',
  },

  btnText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.white,
  },
});
