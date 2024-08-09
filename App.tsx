import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Sound from 'react-native-sound';
import TouchGesture from './TouchGesture';
Sound.setCategory('Playback');
// var myRemoteSound = new Sound(
//   'https://www.soundjay.com/ambient/sounds/boarding-accouncement-1.mp3',
//   null,
//   error => {
//     if (error) {
//       console.log('failed to load the sound', error);
//       return;
//     } else {
//       myRemoteSound.play(success => {
//         if (success) {
//           console.log('Sound playing');
//         } else {
//           console.log('Issue playing file');
//           console.log(error);
//         }
//       });
//     }
//   },
// );

var myRemoteSound: any;
var WPM = 20;
var length_of_unit = (60 / (50 * WPM)) * 1000;

export default function App() {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (playing) {
      // console.log('playing state changed to true');
    } else {
      // console.log('playing state changed to false');
    }
  }, [playing]);
  const intervalRef = useRef<any>(null);
  const [scrollable, setScrollable] = React.useState(true);

  useEffect(() => {
    myRemoteSound = new Sound('toneSound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      } else {
        // console.log(
        //   'duration in seconds: ' +
        //     myRemoteSound.getDuration() +
        //     'number of channels: ' +
        //     myRemoteSound.getNumberOfChannels(),
        // );
      }
    });
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
          // console.log('Sound playing');
        } else {
          setPlaying(false);
          // console.log('Issue playing file');
          console.log(Error);
        }
      });
    }
  };
  // const playSound = () => {
  //   console.log('before sound, playing=', playing);
  //   if (!playing) {
  //     setPlaying(true);
  //     myRemoteSound.setVolume(1);
  //     myRemoteSound.setNumberOfLoops(-1).play();
  //     setPlaying(false);
  //     console.log('play sound initiated');
  //   } else {
  //     null;
  //   }
  // };
  const playSound = () => {
    // console.log('before sound, playing=', playing);
    if (!playing) {
      setPlaying(true);
      myRemoteSound.setVolume(1);
      myRemoteSound.setNumberOfLoops(-1).play();
      setPlaying(false);
      // console.log('play sound initiated');
    } else {
      null;
    }
  };
  const pauseSound = () => {
    // console.log('before stop, playing=', playing);

    if (!playing) {
      myRemoteSound.setVolume(0);
      setPlaying(false);
      // console.log('stop sound, playing=', playing);
    } else {
      null;
    }
  };

  const playDot = () => {
    playSound();
    setTimeout(() => {
      pauseSound();
    }, length_of_unit);
  };

  const playDash = () => {
    myRemoteSound.setVolume(1);
    myRemoteSound.setNumberOfLoops(-1).play();
    setTimeout(() => {
      myRemoteSound.setVolume(0);
    }, length_of_unit * 3);
  };

  const rewind = () => {
    myRemoteSound.setCurrentTime(1);
  };

  const DotInterval = () => {
    intervalRef.current = setInterval(playDot, length_of_unit + length_of_unit);
  };

  const DashInterval = () => {
    playDash();
    intervalRef.current = setInterval(
      playDash,
      length_of_unit * 3 + length_of_unit,
    );
  };

  const stopSound = () => {
    clearInterval(intervalRef.current);
  };
  const playMorse = sequence => {
    let index = 0;
    const playNext = () => {
      if (index < sequence.length) {
        const symbol = sequence[index];
        index++;
        if (symbol === '.') {
          playDot();
          setTimeout(playNext, length_of_unit + length_of_unit);
        } else if (symbol === '-') {
          playDash();
          setTimeout(playNext, length_of_unit * 3 + length_of_unit);
        } else if (symbol === ' ') {
          setTimeout(playNext, length_of_unit * 3 - length_of_unit);
        } else if (symbol === '/') {
          setTimeout(playNext, length_of_unit * 7 - length_of_unit);
          rewind();
        } else if (symbol === '') {
          rewind();
        }
      }
    };
    playNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPressIn={playSound} onPressOut={pauseSound}>
        <Text>Tone</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={playDot} onPressOut={rewind}>
        <Text>Dot</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={playDash} onPressOut={rewind}>
        <Text>Dash</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={DotInterval} onPressOut={stopSound}>
        <Text>Dot Interval</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={DashInterval} onPressOut={stopSound}>
        <Text>Dash Interval</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => playMorse('... --- .../--- . ---')}>
        <Text>Play SOS</Text>
      </TouchableOpacity>
      <TouchGesture
        onDxRight={playDot}
        onDxLeft={playDash}
        length_of_unit={length_of_unit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
