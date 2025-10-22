import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';


export default ({longPress}) => {
     return (
      <MapView 
      style={styles.mapa}
      onLongPress={longPress}
      />
    );
}

const styles = StyleSheet.create({
  mapa:{
    width:Dimensions.get("window").width,
    height:Dimensions.get("window").height-140,
  },
})