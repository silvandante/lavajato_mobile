import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    SafeAreaView,
    Text
} from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { ActivityIndicator, Button } from "react-native-paper"
import { useSelector } from "react-redux"
import ScheduleItem from "../../components/ScheduleItem"
import { getOrder, getOrders } from "../../config/endpoints"
import { theme } from "../../utils/theme"

const Schedules = ({navigation}) => {

    const { user } = useSelector(state => state)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataError, setDataError] = useState("")

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            getOrdersData()
        });

        return _unsubscribe
    }, [])

    const getOrdersData = () => {
        setDataError("")
        setLoading(true)
        switch(user.user.role) {
            case "ADMIN":
                getOrders("ADMIN", user.user.token).then((result) => {
                    if(result.data.message != undefined) {
                        setDataError(error.message)
                        setLoading(false)
                    } else {
                        const list = result.data
                        setData(list.reverse())
                        setLoading(false)
                    }
                }).catch((error) => {
                    setDataError(error.message)
                    setLoading(false)
                })
                break
            case "CLIENT":
                getOrders("CLIENT", user.user.token).then((result) => {
                    if(result.data.message != undefined) {
                        setDataError(error.message)
                        setLoading(false)
                    } else {
                        const list = result.data
                        setData(list.reverse())
                        setLoading(false)
                    }
                }).catch((error) => {
                    setDataError(error.message)
                    setLoading(false)
                })
                break
            default:
                setData([])
                setLoading(false)
                break
        }
    }

    return(
        <SafeAreaView style={{padding: 15, flex: 1}}>
            {user.user.role == "CLIENT" &&
            <Button theme={theme} onPress={() => navigation.navigate("AddSchedule")} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" >
                Fazer Pedido de Lavagem
            </Button>}
            {!loading && <FlatList
                data={data}
                renderItem={({item}) => <ScheduleItem item={item} role={user.user.role}/>}
                keyExtractor={item => item.id}
            />}
            {loading && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
            {!loading && dataError!="" && <>
                    <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={getOrdersData}>
                        Tentar novamente
                    </Button>
                    <Text>{dataError}</Text>
                </>}
        </SafeAreaView>
    )
}

export default Schedules