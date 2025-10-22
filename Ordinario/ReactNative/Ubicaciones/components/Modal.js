import { StyleSheet, Text, View, Modal } from 'react-native';
export default () => {
    return(
<Modal
        animationType='slide'
        transparent={true}
        visible={false}
      >
        <View style={styles.center}>
          <View style={styles.modalView}>
            <Text>❤️o(*≧▽≦)ツ┏━┓❤️ </Text>
          </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
  modalView:{
    backgroundColor:'#fff',
    borderRadius:10,
    padding:5,
    shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:10,
    }
  },
  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
});