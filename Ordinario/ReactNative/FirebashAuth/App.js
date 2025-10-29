import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button } from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';


export default function App() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ user, setUser] = useState(null);

  const handleLogin = async () => {
    try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
  }
    catch(error){
      Alert.alert("Error", error.message);
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
    }
    catch(error){
      Alert.alert("Error", error.message);
    }
  }

  const handleRefresh = async () => {
    console.log("TOKEN ANTERIOR");
    console.log("");
    const nuevoAccesoToken = await user.getIdToken(true);
    console.log ("TOKEN REGISTRADO");
    
  }

return (
  <View style={styles.container}>
    {
      user ? (
        <>
        <Text style={styles.texto}>Bienvenido {user.email}</Text>
        <Button 
        title="Abandonar Sesión"
        onPress={handleLogout}
        />
        </>
      ):(
        <>
        <Text>Autenticación con firebase</Text>
        
        <TextInput
          style={styles.input}
          placeholder='correo electronico'
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder='password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button
          title="Acceder"
          onPress={handleLogin}
          />
        <View style={{marginBottom:10}}/> 
        <Button
          title="Registrarse"
          onPress={handleSignUp}
        />
        </>
      )
    }
  </View>  
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input:{
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f4f5f4ff",
    borderRadius: 10,
    backgroundColor: "#ffffffff"
  },
  texto:{
    fontSize: 26,
    color: "#f5f5f5ff"
  }
});