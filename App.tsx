import React, {useEffect, useState} from 'react';

import {Button, StyleSheet, View} from 'react-native';

import Sound from 'react-native-sound';
Sound.setCategory('Playback');
var myRemoteSound = new Sound(
  'https://www.soundjay.com/ambient/sounds/boarding-accouncement-1.mp3',
  null,
  error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    } else {
      myRemoteSound.play(success => {
        if (success) {
          console.log('Sound playing');
        } else {
          console.log('Issue playing file');
          console.log(error);
        }
      });
    }
  },
);
export default function App() {
  const [playing, setPlaying] = useState(false); // 초기값을 false로 설정

  useEffect(() => {
    myRemoteSound.setVolume(1);
    return () => {
      myRemoteSound.release();
    };
  }, []);
  const playPause = () => {
    if (myRemoteSound.isPlaying()) {
      myRemoteSound.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
      myRemoteSound.play(success => {
        if (success) {
          setPlaying(false);

          console.log('Sound playing');
        } else {
          setPlaying(false);
          console.log('Issue playing file');
          console.log(Error);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="beep" onPress={playPause} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
