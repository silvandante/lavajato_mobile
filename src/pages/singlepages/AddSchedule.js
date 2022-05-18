import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    Linking,
    ToastAndroid
} from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import { ActivityIndicator, Button, HelperText, IconButton, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../utils/theme"
import { getDate, getTime } from "../../utils/getDateTime"
import { Picker } from "@react-native-picker/picker"
import { useSelector } from "react-redux"
import { createOrder, getVehicles, getWashes } from "../../config/endpoints"


const AddSchedule = ({route, navigation}) => {

    const [loading, setLoading] = useState(false)    

    const { user } = useSelector(state => state);
    
    const [date, setDate] = React.useState(new Date())
    const [time, setTime] = React.useState(new Date())
  
    const [washsData, setWashsData] = useState({loading: true, data: []})
    const [vehicleData, setVehicleData] = useState({loading: true, data: []})

    const [selectedWash, setSelectedWash] = useState("")
    const [selectedVehicle, setSelectedVehicle] = useState("")

    const [datePickerVisible, setDatePickerVisible] = useState(false)
    const [timePickerVisible, setTimePickerVisible] = useState(false)

    const [vehiclesError, setVehiclesError] = React.useState(false)
    const [washError, setWashError] = React.useState(false)

    const [totalPrice, setTotalPrice] = useState("0,00")

    const [addScheduleError, setAddScheduleError] = useState("")

    useEffect(() => {
        setWashsData({loading: true, data: []})
        setVehicleData({loading: true, data: []})

        
        getVehiclesData()
        getWashesData()
    
    }, [])

    const getVehiclesData = () => {
        setVehicleData({loading: true, data: []})
        setVehiclesError("")
        getVehicles(user.user.token).then((list) => {
            if(list.data.message != undefined) {
                setLoading(false)
                setVehiclesError(error.message)
                setVehicleData({loading: false, data: []})
            } else {
                setLoading(false)
                setVehicleData({loading: false, data: list.data})
                setSelectedVehicle(list.data[0])
            }
        }).catch((error) => {
            setWashsData({loading: false, data: []})
            setVehiclesError(error.message)
        })
    }

    const getWashesData = () => {
        setWashsData({loading: true, data: []})
        setWashError("")
        getWashes(user.user.token).then((list) => {
            if(list.data.message != undefined) {
                setLoading(false)
                setWashsData({loading: false, data: []})
                setWashError(error.message)
            } else {
                setLoading(false)
                setWashsData({loading: false, data: list.data})
                setSelectedWash(list.data[0])
            }
        }).catch((error) => {
            setWashsData({loading: false, data: []})
            setWashError(error.message)
        })
    }

    const confirmAdd = () => {
        setLoading(true)
        setAddScheduleError('')

        const dateValue = new Date(date).toISOString().split("T")[0]
        const timeValue = new Date(time).toISOString().split("T")[1]

        const completeDate = dateValue+"T"+timeValue

        createOrder(selectedVehicle.id, selectedWash.id, completeDate, user.user.token)
        .then((result) => {
            if(result.data.message != undefined) {
                setLoading(false)
                setAddScheduleError("Não foi possível adicionar esse agendamento, tente novamente!")

            } else {
                ToastAndroid.show( "Agendamento adicionado com sucesso", ToastAndroid.SHORT);
                navigation.pop()
            }
        }).catch((error) => {
            setLoading(false)
            setAddScheduleError("Não foi possível adicionar esse agendamento, tente novamente!")
        })
    }

    useEffect(() => {
        const selectedVehiclePrice = parseFloat(selectedVehicle.preco)
        const selectedWashPrice = parseFloat(selectedWash.preco)

        setTotalPrice((selectedVehiclePrice+selectedWashPrice).toFixed(2).toString().replace(".", ","))
    }, [selectedVehicle, selectedWash])

    return(
        <SafeAreaView style={{padding: 20, backgroundColor: theme.colors.softDisable, height: "100%", width: "100%", flexDirection: "column"}}>
            {(!loading || (!washsData.loading && !vehicleData.loading)) && <>
            <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                <IconButton
                    icon="close"
                    color={theme.colors.secondary}
                    size={35}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <Title style={{alignSelf: "center", textAlign: "center", marginBottom: 30}}>Agendar</Title>
            <Text style={{color: theme.colors.disabled}}>Escolha o tipo de veículo</Text>
            
            <Picker
                style={{marginBottom: 25}}
                selectedValue={selectedVehicle.id}
                onValueChange={(itemValue, itemIndex) => {
                    const value = vehicleData.data.find(item => item['id'] == itemValue)
                    setSelectedVehicle(value)
                }}>
                {vehicleData.data.map((value) => <Picker.Item key={value.id} label={value.titulo} value={value.id}/>)}
            </Picker>
            <Text style={{color: theme.colors.disabled}}>Escolha o tipo de lavagem</Text>
            <Picker
                style={{marginBottom: 25}}
                selectedValue={selectedWash.id}
                onValueChange={(itemValue, itemIndex) => {
                    const value = washsData.data.find(item => item['id'] == itemValue)
                    setSelectedWash(value)
                }}>
                {washsData.data.map((value) => <Picker.Item key={value.id} label={value.titulo + "(" + value.descricao+")"} value={value.id}/>)}
            </Picker>
            <Button theme={theme} icon="calendar" mode="outline" style={{borderWidth: 1, borderColor: theme.colors.primary, marginBottom: 18}} onPress={() => setDatePickerVisible(true)}>
                Escolher data: {getDate(new Date(date).toISOString())}
            </Button>
            <Button theme={theme} icon="clock" mode="outline" style={{borderWidth: 1, borderColor: theme.colors.primary, marginBottom: 18}} onPress={() => setTimePickerVisible(true)}>
                Escolher hora: {getTime(new Date(time).toISOString().split("T")[1])}
            </Button>
            {datePickerVisible && <DateTimePicker
                value={new Date(date)}   
                is24Hour={true}
                mode={"date"}
                timeZoneOffsetInMinutes={0}
                minimumDate={Date.parse(new Date())}
                display='default'
                disabled={loading}
                onChange={(event, date) => {
                    if (event != null) {
                        setDate(event.nativeEvent.timestamp)
                    }

                    setDatePickerVisible(false)
                }}
                />}
            {timePickerVisible && <DateTimePicker
                value={new Date(time)}   
                is24Hour={true}
                timeZoneOffsetInMinutes={0}
                mode={"time"}
                disabled={loading}
                minimumDate={Date.parse(new Date())}
                display='default'
                onChange={(event, date) => {
                    if (date != null) {
                        setTime(date)
                    }

                    setTimePickerVisible(false)
                }}
                />}
                {!washsData.loading && !vehicleData.loading && 
                <>
                <Text style={{fontWeight: "bold", color: theme.colors.primary, textAlign: "center", fontSize: 25, marginBottom: 40}}>R$ {totalPrice}</Text>
                <Button theme={theme} style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => confirmAdd()}>
                    Confirmar
                </Button>
                </>}

                {addScheduleError != "" && <HelperText type="error">
                    {addScheduleError}
                </HelperText>}
            
            </>}
        {((washsData.loading && vehicleData.loading) || loading) && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
        {(washError != "") && <HelperText type="error">
            {washError}
        </HelperText>}
        {(vehiclesError != "") && <HelperText type="error">
            {vehiclesError}
        </HelperText>}     
        {(washError != "" || vehiclesError!="") && <>
            <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={getWashesData}>
                Tentar novamente
            </Button>
        </>}
        </SafeAreaView>
    )
}

export default AddSchedule