import React from "react"

import {
    StyleSheet,
    View,
    Text
} from "react-native"

const UserItem = ({item}) => {
    return(
        <>{item != null && <View style={styles.container}>
            <View style={{width: "80%", padding: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 18}}>{item.nome}</Text>
                <Text>{item.email}</Text>
                <Text>{item.phone}</Text>
                <Text style={{marginTop: 6, fontSize: 12}}>{item.roles == "CLIENT" ? "Cliente" : "Gerente"}</Text>
            </View>
        </View>}
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

export default UserItem