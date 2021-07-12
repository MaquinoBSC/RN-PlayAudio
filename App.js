import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import TrackPlayer, { Events } from 'react-native-track-player';
import {NativeBaseProvider, Button, Center, Box} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function App(){
  const [Trackstatus, setTrackStatus]= useState(2);
  Sound.setCategory('Playback');

  useEffect(()=> {
    loadTrack();
  }, []);
  

  // Load the sound file 'whoosh.mp3' from the app bundle
  // See notes below about preloading sounds within initialization code below.
  let whoosh = new Sound('homero_batman.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
  });

  const playAudio= ()=> {
    // Play the sound with an onEnd callback
    whoosh.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  }

  const stopAudio= ()=> {
    whoosh.stop();
  }
  


  const loadTrack= async()=>{
    // Set up the player
    await TrackPlayer.setupPlayer();

    // Add a track to the queue
    await TrackPlayer.add({
        id: 'trackId',
        url: require('./src/assets/audio/homero.mp3'),
        title: 'Track Title',
        artist: 'Track Artist',
        //artwork: require('track.png')
    });
    console.log("Cargado");
  }

  const start = async () => {
    // Start playing it
    if(Trackstatus == 1 || Trackstatus == 0 || TrackPlayer== 2){
      await loadTrack()
      setTrackStatus(await TrackPlayer.getState());
    }

    await TrackPlayer.play()
    setTrackStatus(await TrackPlayer.getState());
  }

  const pause= async()=> {
    await TrackPlayer.pause();
    setTrackStatus(await TrackPlayer.getState());
  }

  const stop= async()=> {
    await TrackPlayer.stop();
    setTrackStatus(await TrackPlayer.getState());
  }

  const state= async()=> {
    console.log(await TrackPlayer.getCurrentTrack());
    console.log(await TrackPlayer.getState());
  }

  TrackPlayer.addEventListener('playback-queue-ended', async()=> {
    await TrackPlayer.pause();
    setTrackStatus(await TrackPlayer.getState());
  })


  return(
    <NativeBaseProvider>
      <View>
        <Text style={styles.title}>Play Audio</Text>
        <View style={styles.container}>
          <Text style={styles.subtitle}>react-native-sound</Text>
          <Text>{whoosh.isLoaded().valueOf()}</Text>
          <Box style={styles.box}>
            <Button
              style={styles.button}
              variant="solid"
              size="sm"
              colorScheme="secondary"
              onPress={()=> playAudio()}
            >
              <FontAwesome5 
                name={"play"}
              />
            </Button>
            <Button
              style={styles.button}
              variant="solid"
              size="sm"
              colorScheme="secondary"
              onPress={()=> stopAudio()}
            >
              <FontAwesome5 
              name="stop"
              />
            </Button>

            <Button
              style={styles.button}
              variant="solid"
              size="sm"
              colorScheme="secondary"
              onPress={()=> status()}
            >
              <FontAwesome5 
              name="code"
              />
            </Button>
          </Box>
        </View>

        <View style={styles.container}>
          <Text style={styles.subtitle}>react-native-track-player</Text>
          <Text>{whoosh.isLoaded().valueOf()}</Text>
          <Box style={styles.box}>
            <Button
              style={styles.button}
              variant="solid"
              size="sm"
              colorScheme="secondary"
              onPress={()=> Trackstatus == 2 || Trackstatus== 1 || Trackstatus== 0 ? start() : pause()}
            >
              <FontAwesome5 
                name={(Trackstatus== 2 || Trackstatus== 1 || Trackstatus== 0) ? 'play' : 'pause'}
              />
            </Button>
            {
              Trackstatus == 3 ? (
                <Button
                  style={styles.button}
                  variant="solid"
                  size="sm"
                  colorScheme="secondary"
                  onPress={()=> stop()}
                >
                  <FontAwesome5 
                  name="stop"
                  />
                </Button>
              ) : null
            }
            <Button
              style={styles.button}
              variant="solid"
              size="sm"
              colorScheme="secondary"
              onPress={()=> state()}
            >
              <FontAwesome5 
              name="code"
              />
            </Button>
          </Box>
        </View>
      </View>
    </NativeBaseProvider>
  )
}

const styles= StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    width: '100%',
    height: 'auto',
    marginVertical: 10,
  },
  box: {
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  button:{
    width: 50,
    marginHorizontal: 5,
  }
})