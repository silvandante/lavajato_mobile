import React, { useState } from "react"

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
import { setUser } from "../redux/actions";
import { useDispatch } from "react-redux";
import { login, register } from "../config/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState({ value: '', error: '' })
    const [phone, setPhone] = useState({ value: '', error: '' })
    const [name, setName] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [password2, setPassword2] = useState({ value: '', error: '' })
    const [registerError, setRegisterError] = useState('')

    const dispatch = useDispatch()

    const _onRegisterPressed = () => {
        setLoading(true)
        setRegisterError('')

        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        const password2Error = validatePassword2()
        const nameError = validateName()
        const phoneError = validatePhone()

        if (emailError || passwordError || password2Error || nameError || phoneError) {
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            setPassword2({ ...password2, error: password2Error })
            setName({ ...name, error: nameError })
            setPhone({ ...phone, error: phoneError })
            setLoading(false)
            return
        }

        handleSignUp()
    }

    const validateName = () => {
        if (name.value ==null || name.value=="") 
            return "Nome n??o pode ser vazio"
        else
            return ''
    }

    const validatePhone = () => {
        if (phone.value ==null || phone.value =="") 
            return "Telefone n??o pode ser vazio"
        else
            return ''
    }

    const validatePassword2 = () => {
        if (password.value != password2.value)
            return "As senhas n??o correspondem"
        else
            return ''
    }

    const goToLogin = () => {
        const resetAction = CommonActions.reset({
            index: 1,
            routes: [{ name: "Login"}]
          });
        navigation.dispatch(resetAction);
    }

    const goToDashboard = () => {
        const resetAction = CommonActions.reset({
            index: 1,
            routes: [{ name: "Dashboard"}]
          });
        navigation.dispatch(resetAction);
    }

    const handleSignUp = async () => {
        register(name.value, password.value, email.value, phone.value)
        .then((user) => {
            login(email.value, password.value).then((result) => {
                if(result.data.message != undefined) {
                    setRegisterError("Erro: "+result.message)
                    setLoading(false)
                } else {
                    const _user = {
                        email: result.data.email,
                        login: result.data.login,
                        uid: result.data.id,
                        role: result.data.roles,
                        name: result.data.nome,
                        phone: result.data.phone,
                        token: result.data.token
                    }
        
                    dispatch(
                        setUser(_user)
                    )

                    storeData(_user).then(() => {
                        setLoading(false)
                        goToDashboard()
                    })

                }
            }).catch((error) => {
                setRegisterError("Erro: "+error.message)
                setLoading(false)
            })
            
        })
        .catch((error) => {
            setRegisterError("Erro: "+error.message)
            setLoading(false)
        })
    }

    const storeData = async (value) => {
        await AsyncStorage.setItem('meulavajato@user', JSON.stringify(value))
    }


    return(
        <View style={styles.container}>
            <Title>Criar sua conta de cliente</Title>

            <TextInput
                label="Nome"
                returnKeyType="next"
                disabled={loading}
                value={name.value}
                style={{marginBottom: 15}}
                onChangeText={text => setName({ value: text, error: '' })}
                error={name.error != ''}
            />
            {name.error != '' && <HelperText type="error" style={styles.input}>
                {name.error}
            </HelperText>}

            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                disabled={loading}
                style={{marginBottom: 15}}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={email.error != ''}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            {email.error != '' && <HelperText type="error" style={styles.input}>
                {email.error}
            </HelperText>}

            <TextInput
                label="Telefone"
                returnKeyType="next"
                disabled={loading}
                value={phone.value}
                style={{marginBottom: 15}}
                onChangeText={text => setPhone({ value: text, error: '' })}
                error={phone.error != ''}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            {phone.error != '' && <HelperText type="error" style={styles.input}>
                {phone.error}
            </HelperText>}

            <TextInput
                label="Senha"
                returnKeyType="done"
                value={password.value}
                disabled={loading}
                style={{marginBottom: 15}}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={password.error != ''}
                errorText={password.error}
                secureTextEntry
            />

            {password.error != '' && <HelperText type="error" style={styles.input}>
                {password.error}
            </HelperText>}

            <TextInput
                label="Confirmar Senha"
                returnKeyType="done"
                disabled={loading}
                value={password2.value}
                style={{marginBottom: 15}}
                onChangeText={text => setPassword2({ value: text, error: '' })}
                error={password2.error != ''}
                errorText={password2.error}
                secureTextEntry
            />

            {password2.error != '' && <HelperText type="error" style={styles.input}>
                {password2.error}
            </HelperText>}

            {!loading && <Button mode="contained" onPress={_onRegisterPressed}>
                Registrar
            </Button>}

            {loading && <ActivityIndicator size={"small"} color={theme.colors.primary}/>}

            {registerError != '' && <HelperText type="error" style={{marginTop: 10, marginBottom: 30, alignSelf: "center", textAlign: "center"}}>
                {registerError}
            </HelperText>}

            <View style={styles.row}>
                {!loading && <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.link}>Voltar</Text>
                </TouchableOpacity>}
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

export default Register