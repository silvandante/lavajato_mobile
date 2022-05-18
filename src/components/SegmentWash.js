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
import AddTypeModal from "./AddTypeModal";
import TypeItem from "./TypeItem";
import { theme } from "../utils/theme";
import { getWashes } from "../config/endpoints";
import { useSelector } from "react-redux";


const SegmentWash = () => {

    const [addTypeModalVisible, setAddTypeModalVisible] = useState(false)
    const [typesWashData, setTypesWashData] = useState([])
    const [washDataError, setWashDataError] = useState("")
    const [loading, setLoading] = useState(false)


    const { user } = useSelector(state => state)
    
    useEffect(() => {
        getWashesData()
    }, [])

    const getWashesData = () => {
        setWashDataError("")
        setLoading(true)
        getWashes(user.user.token).then((data) => {
            if(data.data.message != undefined){
                setWashDataError(error.message)
                setLoading(false)
            } else {
                setTypesWashData(data.data)
                setLoading(false)
            }
        }).catch((error) => {
            setWashDataError(error.message)
            setLoading(false)
        })
    }
    const completeAction = (newItem) => {
        getWashesData()
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
            <View style={{position: "absolute"}}>
                <AddTypeModal confirmAction={completeAction} typeToAdd="WASH" labelTitle={"Lavagem"} labelPrice={"Preço"} labelDescription={"Adicione um novo tipo de lavagem:"} visible={addTypeModalVisible} setVisible={visible => setAddTypeModalVisible(visible)}/>
            </View>
            <View style={{ flex: 1, display: "flex" }}>
                <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={() => setAddTypeModalVisible(true)}>
                    Adicionar tipo de lavagem
                </Button>
                {!loading && <FlatList
                    removeClippedSubviews={false}
                    data={typesWashData}
                    renderItem={({item}) => <TypeItem item={item} type={"WASH"} role={"ADMIN"}/>}
                    keyExtractor={item => item.id}
                />}
                {loading && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
                {!loading && washDataError!="" && <>
                    <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={getWashesData}>
                        Tentar novamente
                    </Button>
                    <Text>{washDataError}</Text>
                </>}
            </View>
        </SafeAreaView>
    )
}

export default SegmentWash