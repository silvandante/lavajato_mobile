import * as React from 'react';
import { Portal, Text, Provider, IconButton, TextInput, HelperText, Button, ActivityIndicator } from 'react-native-paper';
import { View, Modal, ScrollView } from 'react-native'
import { theme } from '../utils/theme';
import { isNullOrEmpty } from '../utils/isNullOrEmpty';
import { addVehicle, addWash } from '../config/endpoints';
import { useSelector } from 'react-redux';

const AddTypeModal = ({visible, setVisible, labelDescription, labelTitle, labelPrice, confirmAction, typeToAdd = ""}) => {

  const [type, setType] = React.useState({value: "", error: ""})
  const [value, setValue] = React.useState({value: "", error: ""})
  const [desc, setDesc] = React.useState({value: "", error: ""})
  const [loadingConfirm, setLoadingConfirm] = React.useState(false)
  const [addTypeError, setAddTypeError] = React.useState("")

  const { user } = useSelector(state => state)

  const hideModal = () => setVisible(false);
  const containerStyle = {flexGrow: 1 ,flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "rgba(0,0,0,0.5)", top: 0, bottom: 0, left: 0, right: 0, padding: 20, width: "100%"};

  const addType = () => {
    setAddTypeError('')
    let oneError = false;

    if(isNullOrEmpty(type.value)) {
      oneError = true;
      setType({value: "", error: "Kilometragem não pode ser vazio"})
    }

    if(isNullOrEmpty(value.value)) {
      oneError = true;
      setValue({value: "", error: "Código não pode ser vazio"})
    }

    if(typeToAdd == "WASH" && isNullOrEmpty(desc.value)) {
      oneError = true;
      setDesc({value: "", error: "Descrição não pode ser vazio"})
    }

    if (oneError)
      return

    setLoadingConfirm(true)

    let item = {
      title: type.value,
      price: value.value,
      desc: isNullOrEmpty(desc.value) ? '' : desc.value
    }

    if (typeToAdd == "WASH") {
      addWash(item.title, item.price, item.desc,user.user.token).then((result) => {
        setLoadingConfirm(false)
        setVisible(false)
        confirmAction(result.data)
      }).catch((error) => {
        setLoadingConfirm(false)
        setAddTypeError(error.message)
      })
    } else {
      addVehicle(item.title, item.price, user.user.token).then((result) => {
        setLoadingConfirm(false)
        setVisible(false)
        confirmAction(result.data)
      }).catch((error) => {
        setLoadingConfirm(false)
        setAddTypeError(error.message)
      })
    }
  }

  React.useEffect(() => {
    if(visible == true) {
      setType({value: "", error: ""})
      setDesc({value: "", error: ""})
      setValue({value: "", error: ""})
    }
  }, [visible])
  
  return (
    <Provider>
      <Portal>
        <Modal transparent visible={visible}>
            <View style={containerStyle}>
              <ScrollView style={{flexGrow: 0, backgroundColor: "white", alignSelf: "center", borderRadius: 10, padding: 20}}>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                  <IconButton
                      icon="close"
                      color={theme.colors.secondary}
                      size={30}
                      onPress={hideModal}
                  />
                </View>
                <Text>{labelDescription}</Text>
                <TextInput
                    label={labelTitle}
                    returnKeyType="next"
                    theme={theme} 
                    value={type.value}
                    onChangeText={text => setType({ value: text, error: "" })}
                    error={type.error != ''}
                    autoCapitalize="none"
                />
                <HelperText type="error" visible={type.error != ""} >
                    {type.error}
                </HelperText>
                {typeToAdd == "WASH" && 
                <>
                    <TextInput
                        label={"Descrição"}
                        returnKeyType="next"
                        theme={theme} 
                        value={desc.value}
                        onChangeText={text => setDesc({ value: text, error: "" })}
                        error={desc.error != ''}
                        autoCapitalize="none"
                    />
                    <HelperText type="error" visible={desc.error != ""} >
                        {desc.error}
                    </HelperText>
                </>}
                <TextInput
                    label={labelPrice}
                    returnKeyType="next"
                    theme={theme} 
                    value={value.value}
                    onChangeText={text => setValue({ value: text, error: "" })}
                    error={value.error != ''}
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
                <HelperText type="error" visible={value.error != ""} >
                    {value.error}
                </HelperText>
                {!loadingConfirm && <Button theme={theme} style={{marginBottom: 15}} icon="check" mode="contained" onPress={addType}>
                    Adicionar
                </Button>}
                {addTypeError!='' && <HelperText type="error">
                    {addTypeError}
                </HelperText>}
                {loadingConfirm && <ActivityIndicator animating={true} size={"small"} color={theme.colors.primary}/>}
              </ScrollView>
            </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default AddTypeModal;