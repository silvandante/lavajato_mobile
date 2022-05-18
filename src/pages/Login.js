import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native"

import { NavigationActions, CommonActions } from '@react-navigation/native';
import { Title, TextInput, Button, HelperText, ActivityIndicator } from 'react-native-paper';
import { emailValidator } from "../utils/emailValidator";
import { passwordValidator } from "../utils/passwordValidator";
import { theme } from "../utils/theme";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../config/endpoints";

const Login = ({ navigation }) => { 
    const dispatch = useDispatch()

    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [loginError, setLoginError] = useState('')
    const [loading, setLoading] = useState(false)
    const [successEmailReset, setSuccessEmailReset] = useState("")

    useEffect(() => {
        setLoading(true)

        getUserData().then((data) => {
            if(data != null) {
                const user__ = JSON.parse(data)
                dispatch(
                    setUser(user__)
                )

                const resetAction = CommonActions.reset({
                    index: 1,
                    routes: [{ name: "Dashboard"}]
                })

                navigation.dispatch(resetAction)

                return
            } else {
                setLoading(false)
            }
        })
    }, [])

    const handleLogin = (data) => {
        const _user = {
            email: data.email,
            login: data.login,
            uid: data.id,
            role: data.roles,
            name: data.nome,
            phone: data.phone,
            token: data.token
        }

        dispatch(
            setUser(_user)
        )

        const resetAction = CommonActions.reset({
            index: 1,
            routes: [{ name: "Dashboard"}]
        })

        storeData(_user).then(() => {
            navigation.dispatch(resetAction)
        })
    }

    const _onLoginPressed = () => {
        setLoading(true)
        setLoginError('')
        setSuccessEmailReset('')
        const emailError = emailValidator(email.value)
        const passwordError = password.value != null ? "" : "Senha não pode ser vazio"

        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError })
            setLoading(false)
            return
        }

        login(email.value, password.value).then((user) => {
            setLoading(false)
            if (user.data.message != undefined) {
                setLoginError("Não foi possível realizar login com essas credenciais")
            } else {
                handleLogin(user.data)
            }
        }).catch(() => {
            setLoginError("Não foi possível realizar login com essas credenciais")
            setLoading(false)
        })
    }

    const storeData = async (value) => {
        await AsyncStorage.setItem('meulavajato@user', JSON.stringify(value))
    }

    const getUserData = async () => {
        try {
          const value = await AsyncStorage.getItem('meulavajato@user')
          if(value !== null) {
            return value
          } else {
              return null
          }
        } catch(e) {
          alert(JSON.stringify(e))
        }
    }
    
    return(
        <View style={styles.container}>
            <Title>Bem vindo ao Meu Lava Jato.</Title>

            <TextInput
                label="Email"
                returnKeyType="next"
                disabled={loading}
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={email.error != ''}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                theme={theme}
            />
            <HelperText type="error" visible={email.error != ''} style={styles.input}>
                {email.error}
            </HelperText>

            <TextInput
                label="Password"
                returnKeyType="done"
                disabled={loading}
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={password.error != ''}
                errorText={password.error}
                secureTextEntry
                theme={theme}
            />

            <HelperText type="error" visible={password.error != ''} style={styles.input}>
                {password.error}
            </HelperText>

            {!loading && <Button theme={theme} mode="contained" onPress={_onLoginPressed}>
                Login
            </Button>}

            {loading && <ActivityIndicator size={"small"} color={theme.colors.primary}/>}

            {loginError != '' && <HelperText type="error" style={{marginTop: 10, marginBottom: 30, alignSelf: "center", textAlign: "center"}}>
                {loginError}
            </HelperText>}

            {successEmailReset != '' && <HelperText type="info" style={{color: "white", borderRadius: 4, width: "100%", marginTop: 10, backgroundColor: theme.colors.success, fontSize: 20,marginBottom: 30, alignSelf: "center", textAlign: "center"}}>
                {successEmailReset}
            </HelperText>}

            <View style={styles.row}>
                {!loading && <>
                    <Text style={styles.label}>É um cliente e não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Criar conta</Text>
                    </TouchableOpacity>
                </>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 20
    },
    input: {
        marginBottom: 20
    },
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      marginTop: 20,
      justifyContent: "center",
    },
    label: {
      color: theme.colors.secondary,
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
});

export default Login