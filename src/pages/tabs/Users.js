import React, { useEffect, useState } from "react"

import { Title, TextInput, Button, HelperText } from 'react-native-paper';


import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    FlatList,
    ActivityIndicator
} from "react-native"
import { theme } from "../../utils/theme";
import { useSelector } from "react-redux";
import { getUsers } from "../../config/endpoints";
import UserItem from "../../components/UserItem";


const Users = () => {

    const [addTypeModalVisible, setAddTypeModalVisible] = useState(false)
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(false)
    const [usersError, setUsersError] = useState("")
    
    const { user } = useSelector(state => state)

    useEffect(() => {
        setLoading(true)
        getUsersData()
    }, [])

    const getUsersData = () => {
        setUsersError("")
        getUsers(user.user.token).then((data) => {
            if(data.data.message != undefined) {
                setUsersError(error.message)
                setLoading(false)
            } else {
                setUsersData(data.data)
                setLoading(false)
            }
        }).catch((error) => {
            setUsersError(error.message)
            setLoading(false)

        })
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
            <View style={{ flex: 1, display: "flex" }}>
                {!loading && <FlatList
                    data={usersData}
                    renderItem={({item}) => <UserItem item={item}/>}
                    keyExtractor={item => item.id}
                />}
                {loading && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
                {!loading && usersError!="" && <>
                    <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={getVehiclesData}>
                        Tentar novamente
                    </Button>
                    <Text>{usersError}</Text>
                </>}
            </View>
        </SafeAreaView>
    )
}

export default Users