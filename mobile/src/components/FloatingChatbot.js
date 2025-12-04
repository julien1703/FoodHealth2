import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const FloatingChatbot = ({ score }) => {
  const getFaceImage = () => {
    if (score >= 70) {
      return require('../../assets/images/good.png');
    } else if (score >= 40) {
      return require('../../assets/images/middle.png');
    } else {
      return require('../../assets/images/bad.png');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={getFaceImage()} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default FloatingChatbot;


