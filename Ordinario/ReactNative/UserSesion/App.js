import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { userToken, AuthProvider, AuthContext } from './AuthContext';
import React, {useContext} from 'react';

function MainScreen(){
  const {userToken, login, logout} = useContext(AuthContext);

  return(
    <View style={styles.container}>
      <Text onPress={()=>login(" token246")}>Logeate!{userToken}</Text>
      <StatusBar style="auto" />
      <Button title="logout" onPress={()=>logout()}/>
    </View>
  )
}


export default function App() {
  return (
    <AuthProvider>
      <MainScreen/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
