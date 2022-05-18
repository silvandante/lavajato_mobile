import React, { useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    Linking
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, IconButton, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { getActualTime } from "../../utils/getActualTime"
import { getStatus } from "../../utils/getStatus"
import { getStatusColor } from "../../utils/getStatusColor"
import { isNullOrEmpty } from "../../utils/isNullOrEmpty"
import { theme } from "../../utils/theme"
import ZigzagView from "react-native-zigzag-view"
import SuggestNewTimeModal from "../../components/SuggestNewTimeModal"
import RegisterKmModal from "../../components/RegisterKmModal"
import { approveOrder, cancelOrder, finishOrder, parkOrder, payOrder, startOrder } from "../../config/endpoints"
import { useSelector } from "react-redux"


const ScheduleDetail = ({route, navigation}) => {

    const { item, role } = route.params;
    const [itemTemp, setItemTemp] = useState(item)
    const [status, setStatus] = useState(item.status)
    const [date, setDate] = useState(getActualTime(itemTemp))
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [registerKmModalVisible, setRegisterKmModalVisible] = useState(false)
    const [suggestNewTimeVisible, setSuggestNewTimeVisible] = useState(false)
    const [assignWasherModalVisible, setAssignWasherModalVisible] = useState(false)

    const { user } = useSelector(state => state)

    const updateStatus = (newStatus) => {
        setLoading(true)
        setError("")
        switch(newStatus) {
            case "APPROVED":
                approveOrder(itemTemp.id, user.user.token).then((data) => {
                    if(data.data.message != undefined) {
                        setLoading(false)
                        setError(error.message)
                    } else {
                        setLoading(false)
                        setStatus(data.data.status)
                        setDate(getActualTime(data.data))
                    }
                }).catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                break
            case "IN_PARK":
                parkOrder(itemTemp.id, user.user.token).then((data) => {
                    if(data.data.message != undefined) {
                        setLoading(false)
                        setError(error.message)
                    } else {
                        setLoading(false)
                        setStatus(data.data.status)
                    }
                }).catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                break
            case "IN_PROGRESS":
                startOrder(itemTemp.id, user.user.token).then((data) => {
                    if(data.data.message != undefined) {
                        setLoading(false)
                        setError(error.message)
                    } else {
                        setLoading(false)
                        setStatus(data.data.status)
                    }
                }).catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                break
            case "CONCLUDED":
                finishOrder(itemTemp.id, user.user.token).then((data) => {
                    if(data.data.message != undefined) {
                        setLoading(false)
                        setError(error.message)
                    } else {
                        setLoading(false)
                        setStatus(data.data.status)
                    }
                }).catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                break
            case "PAYED":
                payOrder(itemTemp.id, user.user.token).then((data) => {
                    if(data.data.message != undefined) {
                        setLoading(false)
                        setError(error.message)
                    } else {
                        setLoading(false)
                        setStatus(data.data.status)
                    }
                }).catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                break
            case "CANCELED":
                cancelOrder(itemTemp.id, user.user.token).then((data) => {
                    if(data.data.message != undefined) {
                        setLoading(false)
                        setError(error.message)
                    } else {
                        setLoading(false)
                        setStatus(data.data.status)
                    }
                }).catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                break
        }
        setStatus(newStatus)
    }

    const callNumber = phone => {
        console.log('callNumber ----> ', phone);
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
          phoneNumber = `telprompt:${phone}`
        }
        else  {
          phoneNumber = `tel:${phone}`
        }
        Linking.canOpenURL(phoneNumber)
        .then(supported => {
          if (!supported) {
            Alert.alert('Phone number is not available')
          } else {
            return Linking.openURL(phoneNumber);
          }
        })
        .catch(err => console.log(err))
    }

    return(
        <SafeAreaView style={{backgroundColor: theme.colors.softDisable, height: "100%", width: "100%", flexDirection: "column"}}>
            <View style={{position: "absolute"}}>
                <RegisterKmModal itemId={itemTemp.id} clientCode={itemTemp.clientCode} managerCode={itemTemp.managerCode} role={role} completeAction={() => setStatus("IN_PARK")} visible={registerKmModalVisible} setVisible={visible => setRegisterKmModalVisible(visible)}/>
                <SuggestNewTimeModal confirmChange={(status, date) => {
                    setStatus(status)
                    setDate(date)
                }} item={item} visible={suggestNewTimeVisible} setVisible={visible => setSuggestNewTimeVisible(visible)}/>
            </View>
            <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                <IconButton
                    icon="close"
                    color={theme.colors.secondary}
                    size={35}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <ZigzagView 
                backgroundColor={"transparent"}
                surfaceColor="white"
                top={false}
                style={{flexDirection: "column",display: "flex", margin: 20}}>
                <View style={{display:"flex", padding: 20}}>
                    <View style={{display: "flex", flexDirection: "row", marginTop: 20, alignItems: "center", marginBottom: 5, justifyContent: "space-between"}}>
                        <Text style={{fontSize: 14, fontWeight: "bold"}}>#{itemTemp.id}</Text>
                        <Text style={{fontSize: 15, backgroundColor: getStatusColor(status, role), color: "white", textAlign: "center", paddingHorizontal: 7, borderRadius: 10}}>{getStatus(status, role)}</Text>
                    </View>
                    <Text style={{marginBottom: 5, fontSize: 18}}>Cliente: {itemTemp.idCliente}</Text>
                    <Text style={{marginBottom: 5, fontSize: 15}}>{itemTemp.veiculoTitulo}</Text>
                    <Text style={{marginBottom: 5, fontSize: 15}}>{itemTemp.lavagemTitulo}</Text>
                    <Text style={{marginBottom: 5, fontSize: 15}}>{itemTemp.lavagemDescricao}</Text>
                    {!isNullOrEmpty(itemTemp.kilometers) && <Text style={{marginBottom: 5, fontSize: 15}}>{itemTemp.kilometragem}</Text>}
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 5, justifyContent: "space-between"}}>
                        <Text style={{color: theme.colors.backdrop, fontSize: 15}}>{date}</Text>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <Text style={{fontSize: 15}}>R$ </Text>
                            <Text style={{fontSize: 19, fontWeight: "bold"}}>{parseFloat(itemTemp.precototal).toFixed(2).split(".")[0]}</Text>
                            <Text style={{fontSize: 15, fontWeight: "bold"}}>,{parseFloat(itemTemp.precototal).toFixed(2).split(".")[1]}</Text>
                        </View>
                    </View>
                </View>
            </ZigzagView>
            <View style={{margin: 20}}>
                {((role=="ADMIN" && status=="PENDING_ADMIN") || (role=="CLIENT" && status=="PENDING_CLIENT")) && 
                <Button theme={theme}  style={{marginBottom: 15}} icon="check" mode="contained" onPress={() => updateStatus("APPROVED")}>
                    Aprovar
                </Button>}
                {((role=="ADMIN" && status=="PENDING_ADMIN") || (role=="CLIENT" && status=="PENDING_CLIENT")) && 
                <Button theme={theme}  style={{marginBottom: 15}}  icon="calendar" mode="contained" onPress={() => setSuggestNewTimeVisible(true)}>
                    Sugerir Novo Horário
                </Button>}
                {((role=="ADMIN" && status=="PENDING_ADMIN") || (role=="CLIENT" && status=="PENDING_CLIENT")) && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} icon="close" mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Reprovar
                </Button>}
                {role=="ADMIN" && status=="PENDING_CLIENT" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Cliente nunca respondeu? Cancelar
                </Button>}
                {role=="CLIENT" && (status=="PENDING_ADMIN" || status=="APPROVED") && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Desistiu? Cancelar
                </Button>}
                {role=="ADMIN" && status=="APPROVED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Cliente não apareceu? Cancelar
                </Button>}
                {role=="ADMIN" && status=="APPROVED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => setRegisterKmModalVisible(true)}>
                    Receber cliente, marcar KM
                </Button>}
                {role=="CLIENT" && status=="APPROVED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => setRegisterKmModalVisible(true)}>
                    Cheguei, marcar KM
                </Button>}
                {/*role=="ADMIN" && status=="IN_PARK" && 
                <Button style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => {
                    setAssignWasherModalVisible(true)
                }}>
                    Atribuir Lavador
                </Button>*/}
                {(role=="ADMIN" || role=="WASHER") && status=="IN_PARK" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => updateStatus("IN_PROGRESS")}>
                    Lavagem Iniciada
                </Button>}
                {(role=="ADMIN" || role=="WASHER") && status=="IN_PROGRESS" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => updateStatus("CONCLUDED")}>
                    Concluir Lavagem
                </Button>}
                {(role=="ADMIN") && status=="CONCLUDED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => updateStatus("PAYED")}>
                    Entregar veículo e receber pagamento
                </Button>}
            </View>
            <View style={{display: "flex", width: "100%", flex: 1, flexDirection: "column", justifyContent: "space-between"}}>
                {role=="ADMIN" && status=="APPROVED" && 
                    <View style={{flexDirection: "column", alignContent: "center"}}>
                        <Title style={{fontSize: 15, color: theme.colors.disabled, alignSelf: "center", textAlign: "center"}}>Cliente prefere marcar KM? Dê a ele esse código:</Title>
                        <Title style={{color: theme.colors.placeholder, alignSelf: "center"}}>{itemTemp.managerCode}</Title>
                    </View>
                }
                {role=="CLIENT" && status=="APPROVED" && 
                    <View style={{flexDirection: "column", alignContent: "center"}}>
                        <Title style={{fontSize: 15, color: theme.colors.disabled, alignSelf: "center", textAlign: "center"}}>Gerente vai marcar KM por você?{"\n"}Dê a ele esse código:</Title>
                        <Title style={{color: theme.colors.placeholder, alignSelf: "center"}}>{itemTemp.clientCode}</Title>
                    </View>
                }
                {role == "ADMIN" && <Button theme={theme} style={{marginBottom: 30, position: status!="APPROVED" ? "absolute" : "relative", bottom: 0, alignSelf: "center"}} icon="phone" mode="outline" onPress={() => callNumber(itemTemp.phone)}>
                    Algum problema? Ligue para o cliente
                </Button>}
            </View>
        </SafeAreaView>
    )
}

export default ScheduleDetail