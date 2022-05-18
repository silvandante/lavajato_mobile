import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Linking,
    Image
} from "react-native"
import { Button, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"
import { getAddress } from "../../config/endpoints"
import { theme } from "../../utils/theme"

const Address = () => {

    const [loading, setLoading] = useState(true)
    const [address, setAddress] = useState({})
    const [addressError, setAddressError] = useState("")
    const { user } = useSelector(state => state)

    useEffect(() => {
        getAddressData()
    }, [])

    const getAddressData = () => {
        setAddressError("")
        setLoading(true)
        getAddress(user.user.token).then((data) => {
            if(data.data.message != undefined) {
                setAddressError(JSON.stringify(error))
                setLoading(false)
            } else {
                setAddress(data.data)
                setLoading(false)
            }
        }).catch((error) => {
            setAddressError(JSON.stringify(error))
            setLoading(false)
        })
    }

    const startNavigation = () => {
        if(!loading) {
            Linking.canOpenURL(address.link).then(supported => {
                if (supported) {
                    Linking.openURL(address.link);
                } else {
                    console.log('Don\'t know how to open URI: ' + url);
                }
            })
        }
    }

    return(
        <SafeAreaView style={{flex: 1}}>
                {!loading &&<View style={{flex: 1, justifyContent: "center"}}>
                    <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 20, marginHorizontal: 15, textAlign: "center"}}>{address.descricao}</Text>
                </View>}
                {!loading &&<View style={{flex: 1, justifyContent: "center"}}>
                <Button icon="map" mode="contained" onPress={startNavigation} style={{marginHorizontal: 15}}>
                  Clique para abrir no mapa
                </Button>
                </View>}
                {(loading) && <ActivityIndicator size={"large"} color={theme.colors.primary} style={{alignSelf: "center"}}/>}
                {!loading && addressError!="" && <>
                    <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={getAddressData}>
                        Tentar novamente
                    </Button>
                    <Text>{addressError}</Text>
                </>}
        </SafeAreaView>
    )
}

export default Address