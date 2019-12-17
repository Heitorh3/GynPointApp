import Reactotron from 'reactotron-react-native';

// run adb reverse tcp:9090 tcp:9090 if not connecting

if (__DEV__) {
    const tron = Reactotron.configure({host: '192.168.100.3'})
        .useReactNative()
        .connect();

    console.tron = tron;

    tron.clear();
}
