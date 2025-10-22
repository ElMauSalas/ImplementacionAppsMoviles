import React, {use, useEffect, useState} from "react";
import { StyleSheet, Text } from "react-native";


export default ()=>{
    const [loadig, setLoadig]=useState(true)

        useEffect(()=>{
            setTimeout(()=>{
                setLoadig(false)
            },2000)
            console.log("Ejecutando Effct...")
            setLoadig(true)
        },[])

        return (    
        <>
            <Text style={styles.texto}>
                {loadig ? "Cargando...":"Listo!!!"}
            </Text>
    
        </>
    )
}

const styles= StyleSheet.create({
    texto:{
        fontSize:48,
    }

})