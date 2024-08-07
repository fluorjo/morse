import React, {useEffect, useRef, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import Sound from 'react-native-sound';
import {WebView} from 'react-native-webview';

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
  const [playing, setPlaying] = useState(false); // 초기값을 false로 설정
  useEffect(() => {
    if (playing) {
      console.log('playing state changed to true');
    } else {
      console.log('playing state changed to false');
    }
  }, [playing]);
  const intervalRef = useRef<any>(null); // 인터벌 참조를 저장할 ref
  const [scrollable, setScrollable] = React.useState(true);

  useEffect(() => {
    myRemoteSound = new Sound('toneSound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      } else {
        console.log(
          'duration in seconds: ' +
            myRemoteSound.getDuration() +
            'number of channels: ' +
            myRemoteSound.getNumberOfChannels(),
        );
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
          console.log('Sound playing');
        } else {
          setPlaying(false);
          console.log('Issue playing file');
          console.log(Error);
        }
      });
    }
  };
  const playSound = () => {
    console.log('before sound, playing=', playing);
    if (!playing) {
      setPlaying(true);
      myRemoteSound.setVolume(1);
      myRemoteSound.setNumberOfLoops(-1).play();
      setPlaying(false);
      console.log('play sound initiated');
    } else {
      null;
    }
  };
  const pauseSound = () => {
    console.log('before stop, playing=', playing);

    if (!playing) {
      myRemoteSound.setVolume(0);
      setPlaying(false);
      console.log('stop sound, playing=', playing);
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

  const startDot = () => {
    setTimeout(() => {
      intervalRef.current = setInterval(playDot, 120); // 60ms마다 playDot 함수 반복
      // myRemoteSound.pause();
    }, 30);
  };

  const startDash = () => {
    playDash();
    intervalRef.current = setInterval(playDash, length_of_unit * 4); // dot 신호의 3배 시간 간격으로 playDash 함수 반복
  };

  const stopSound = () => {
    clearInterval(intervalRef.current); // 인터벌 중지
    pauseSound(); // 사운드 중지
  };
  const webviewRef = React.useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Web Audio API</title>
      </head>
      <body>
        <script>
          let context;
          let gainNode;

          function createContext() {
            try {
              if (!context) {
                context = new (window.AudioContext || window.webkitAudioContext)();
                gainNode = context.createGain();
                window.ReactNativeWebView.postMessage('AudioContext created');
              }
            } catch (error) {
              window.ReactNativeWebView.postMessage('Error creating AudioContext: ' + error.message);
            }
          }

          function playTone() {
            try {
              console.log('playTone function called');
              window.ReactNativeWebView.postMessage('playTone function called');
              if (!context) {
                window.ReactNativeWebView.postMessage('AudioContext is not created');
                return;
              }
              const oscillator = context.createOscillator();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(440, context.currentTime);
              oscillator.connect(gainNode);
              gainNode.connect(context.destination);
              oscillator.start();
              gainNode.gain.setValueAtTime(1, context.currentTime);
              setTimeout(() => {
                gainNode.gain.setValueAtTime(0, context.currentTime);
              }, 1000);
            } catch (error) {
              window.ReactNativeWebView.postMessage('Error playing tone: ' + error.message);
            }
          }

          window.addEventListener("message", function(event) {
            if (event.data === 'playTone') {
              console.log('Message received: playTone');
              window.ReactNativeWebView.postMessage('Message received: playTone');
              createContext();
              playTone();
            }
          });

          document.body.addEventListener('click', createContext); // 사용자가 클릭할 때 오디오 컨텍스트 생성
        </script>
      </body>
    </html>
  `;
  const playTone = () => {
    if (webviewRef.current) {
      webviewRef.current.postMessage('playTone');
      console.log('Message posted: playTone');
    }
  };

  const handleMessage = event => {
    // Alert.alert('WebView message', event.nativeEvent.data);
    // console.log('WebView message:', event.nativeEvent.data);
  };
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPressIn={playSound} onPressOut={pauseSound}>
        <Text>Tone</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={playDot} onPressOut={rewind}>
        <Text>Dot</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={playDash} onPressOut={rewind}>
        <Text>Dash</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={startDot} onPressOut={stopSound}>
        <Text>Dot2</Text>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={startDash} onPressOut={stopSound}>
        <Text>Dah2</Text>
      </TouchableOpacity> */}
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{html: htmlContent}}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        mediaPlaybackRequiresUserAction={false} // 추가 설정
        domStorageEnabled={true} // 추가 설정
      />
      <Button title="Play Tone" onPress={playTone} />

      {/* <TouchableOpacity
        onPressIn={startDash}
        onPressOut={stopSound}
        style={{
          backgroundColor: 'black',
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Dash2</Text>
      </TouchableOpacity> */}

      {/* <Draggable
        x={100}
        y={300}
        renderSize={50}
        renderColor="black"
        renderText="Dot"
        isCircle
        shouldReverse
        // onDrag={() => console.log('drag')}
        onDrag={playDot}
        // onDragRelease={() => console.log('red')}
        onDragRelease={rewind}
      />
      <Draggable
        x={200}
        y={300}
        renderSize={50}
        renderColor="red"
        renderText="Dash"
        isCircle
        shouldReverse
      /> */}
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
