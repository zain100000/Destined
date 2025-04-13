import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';

const {width, height} = Dimensions.get('screen');

const CustomModal = ({
  visible,
  onClose,
  title,
  description,
  animationSource,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {animationSource && (
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={styles.animation}
            />
          )}
          {title && (
            <Text style={[globalStyles.textBlack, styles.modalText]}>
              {title}
            </Text>
          )}
          {description && (
            <Text style={[globalStyles.textBlack, styles.descriptionText]}>
              {description}
            </Text>
          )}
          <View style={styles.buttonContainer}>
            {primaryButtonText && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onPrimaryButtonPress}>
                <Text style={styles.primaryButtonText}>
                  {primaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
            {secondaryButtonText && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondaryButtonPress}>
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalView: {
    margin: height * 0.4,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: height * 0.02,
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.92,
    height: height * 0.44,
  },

  animation: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: height * 0.034,
  },

  modalText: {
    marginBottom: height * 0.01,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.dark,
  },

  descriptionText: {
    textAlign: 'center',
    color: theme.colors.dark,
    fontSize: theme.typography.fontSize.md,
  },

  buttonContainer: {
    marginTop: height * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.048,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width * 0.3,
    minHeight: height * 0.06,
  },

  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
  },

  secondaryButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.large,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.048,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width * 0.3,
    minHeight: height * 0.06,
  },

  secondaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
  },
});
