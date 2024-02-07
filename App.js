import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect } from 'react';
import { API_KEY } from '@env';


export default function App() {
  const [input, setInput] = React.useState('');
  const [selectedLanguage, setSelectedLanguage] = React.useState();
  const [convertedValue, setConvertedValue] = React.useState();
  const [currencies, setCurrencies] = React.useState([]);

  const myHeaders = new Headers();
  myHeaders.append("apikey", API_KEY);

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  useEffect(() => {
    fetch(`https://api.apilayer.com/exchangerates_data/symbols`, requestOptions)
      .then(response => response.json())
      .then(result => setCurrencies(result.symbols))
      .catch(error => console.log('error', error));
  }, []);

  const convert = () => {
    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${selectedLanguage}&amount=${input}`, requestOptions)
      .then(response => response.json())
      .then(result => setConvertedValue(result))
      .catch(error => console.log('error', error));
  }


  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.jpg')} style={{ width: 150, height: 150, borderRadius: 100 }} />
      <Text style={{fontSize: 20, marginTop: 10, fontWeight: 'bold'}}> {convertedValue?.result} €</Text>
      <View style={{ margin: 20, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextInput
          style={{ height: 30, borderBottomWidth: 1, borderBottomColor: 'gray', width: 50, textAlign: 'center' }}
          onChangeText={text => setInput(text)}
          value={input}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Picker
            style={{ width: 120}}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {Object.keys(currencies).map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>
      </View>
      <Button title="Convert" onPress={convert} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
