import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try{
      const userCredential = signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user);
    }catch(error){
      Alert.alert("Login Failed", error.message);
    }

  }

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  }

  const handleSignUp = async () => {
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);  
    } catch(error){
      Alert.alert("Sign Up Failed", error.message);
    }
  }

  const handleRefresh = () =>{
    const nuevoAccesToken= user.getIdToken(true);
  }

  return (
    <View style={styles.container}>
      {
        user ? (
          <>
            <Text>Welcome, {user.email}</Text>
            <Button title="Logout" onPress={handleLogout} />
          </>
        ):(
          <>
            <Text>Authentication with FireBase</Text>
            <TextInput style={styles.input} 
            placeholder='email' 
            value={email} 
            onChangeText={setEmail} 
            keyboardType='email-address'>

            </TextInput>
            <TextInput style={styles.input} 
            placeholder='password' 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry>

            </TextInput>
            <Button style = {styles.Button} title='Login' onPress={handleLogin}></Button>
            <View style={{marginBottom:10}}></View>
            <Button style = {styles.Button} title='Register' on onPress={handleSignUp}></Button>
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create(
    {
      container: {
      flex: 1,
      backgroundColor: '#b2e4f3ff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    input:{
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 5,
    },
  }
);