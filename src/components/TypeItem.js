import React, {useState} from "react"
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import { isNullOrEmpty } from '../utils/isNullOrEmpty'
import { theme } from '../utils/theme'
import { useNavigation } from '@react-navigation/native';
import { TextInputMask, TextInput, IconButton, HelperText, ActivityIndicator } from 'react-native-paper';
import { deleteVehicle, deleteWash, editVehicle, editWash } from "../config/endpoints";
import { useSelector } from "react-redux";

const TypeItem = ({item, role, userId, type}) => {

    const navigation = useNavigation();

    const [editVisible, setEditVisible] = useState(false)
    const [itemValue, setItemValue] = useState(item)
    const [title, setTitle] = useState({value: item!=null ? item.titulo : null, error: ""})
    const [desc, setDesc] = useState({value: item!=null ? item.descricao : null, error: ""})
    const [price, setPrice] = useState({value: item!=null ? item.preco : null, error: ""})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const { user } = useSelector(state => state)

    const updateItem = () => {
        setLoading(true)
        setError("")
        if(type=="WASH") {
            editWash(title.value, price.value, itemValue.id, desc.value, user.user.token).then(() => {
                setEditVisible(false)
                setLoading(false)
            }).catch((error) => {
                setError(error.message)
            })
        } else {
            editVehicle(title.value, price.value, itemValue.id, user.user.token).then(() => {
                setEditVisible(false)
                setLoading(false)
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT)
                setLoading(false)
            })
        }
    }

    const handleXClick = () => {
        setError("")
        if (editVisible) {
            setTitle({value: itemValue.titulo, error: ""})
            setPrice({value: itemValue.preco, error: ""})
            if(type=="WASH") {
                setDesc({value: itemValue.descricao, error: ""})
            }
            setEditVisible(false)
        } else {
            setLoading(true)
            if(type=="WASH") {
                deleteWash(itemValue.id, user.user.token).then(() => {
                    setLoading(false)
                    setItemValue(null)
                }).catch((error) => {
                    setLoading(false)
                    ToastAndroid.show( "Erro. Tente novamente.", ToastAndroid.SHORT)
                })
            } else {
                deleteVehicle(itemValue.id, user.user.token).then(() => {
                    setLoading(false)
                    setItemValue(null)
                }).catch((error) => {
                    setLoading(false)
                    ToastAndroid.show(error.message, ToastAndroid.SHORT)
                })
            }
        }
    }

    const handleEditClick = () => {
        if (editVisible) {
            updateItem()
        } else {
            setEditVisible(true)
        }
    }

    return(
        <>{itemValue != null && <View style={styles.container} onPress={() => setEditVisible(true)}>
            <View style={{width: "80%"}}>
                <TextInput
                    label={"Tipo"}
                    style={{backgroundColor: "white", padding: 0, margin: 0, marginLeft: 15}}
                    value={title.value}
                    onChangeText={text => setTitle({ value: text, error: '' })}
                    autoCapitalize="none"
                    theme={theme} 
                    disabled={!editVisible}
                />
                <HelperText type="error" visible={title.error != ''} style={{height: title.error != '' ? 30 : 0}}>
                    {title.error}
                </HelperText>
                {!isNullOrEmpty(desc.value) && 
                <>
                    <TextInput
                        label={"Descrição"}
                        style={{backgroundColor: "white", padding: 0, margin: 0, marginLeft: 15}}
                        value={desc.value}
                        onChangeText={text => setDesc({ value: text, error: '' })}
                        autoCapitalize="none"
                        theme={theme} 
                        disabled={!editVisible}
                    />
                    <HelperText type="error" visible={desc.error != ''} style={{height: desc.error != '' ? 30 : 0}}>
                        {desc.error}
                    </HelperText>
                </>}
                <TextInput
                    label={"Valor (R$)"}
                    style={{backgroundColor: "white", padding: 0, margin: 0, marginLeft: 15}}
                    value={price.value}
                    onChangeText={text => setPrice({ value: text, error: '' })}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    theme={theme} 
                    disabled={!editVisible}
                />
                <HelperText type="error" visible={price.error != ''} style={{height: price.error != '' ? 30 : 0}}>
                    {price.error}
                </HelperText>
            </View>
            <View style={{width: "20%", justifyContent: "space-around", alignItems: "center"}}>
                {!loading && <IconButton
                    icon={editVisible ? "close" : "trash-can"}
                    color={editVisible ? theme.colors.backdrop : theme.colors.error}
                    size={20}
                    onPress={handleXClick}
                />}
                {!loading && <IconButton
                    icon={editVisible ? "check" : "pencil"}
                    color={theme.colors.primary}
                    size={20}
                    onPress={handleEditClick}
                />}
                {loading && <ActivityIndicator size={"small"} color={theme.colors.primary}/>}
            </View>
        </View>
        }
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        marginBottom: 15
    }
})

export default TypeItem