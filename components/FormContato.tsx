import { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import { global } from '../styles/global';
import * as ImagePicker from 'expo-image-picker';
import { MediaType } from 'expo-image-picker';
import api from '../lib/api';
import { Alert } from 'react-native';

interface Props {
  valores?: any;
  onSubmit: (dados: any) => void;
}

export default function FormContato({ valores, onSubmit }: Props) {
  const [nome, setNome] = useState(valores?.nome || '');
  const [email, setEmail] = useState(valores?.email || '');
  const [telefone, setTelefone] = useState(valores?.telefone || '');
  const [endereco, setEndereco] = useState(valores?.endereco || '');
  const [foto, setFoto] = useState(valores?.foto || '');

  const escolherImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'] as MediaType[] });
    if (!resultado.canceled && resultado.assets.length > 0) {
      const file = resultado.assets[0];
      const form = new FormData();
      form.append('foto', {
        uri: file.uri,
        name: file.fileName || 'imagem.jpg',
        type: file.mimeType || 'image/jpeg'
      } as any);
      try { 
      const res = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFoto(res.data.nomeArquivo);
      }
      catch (err:any) {
        console.log(err);
        console.log('\nResponse: ', err.response);
        console.log('\nRequest: ', err.request);
        Alert.alert('Erro ao fazer upload da imagem');
      }
    }
  };

  const enviar = () => {
    onSubmit({ nome, email, telefone, endereco, foto });
  };

  return (
    <View>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={global.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={global.input} />
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={global.input} />
      <TextInput placeholder="Endereço" value={endereco} onChangeText={setEndereco} style={global.input} />
      <Button title="Selecionar imagem" onPress={escolherImagem} />
      {foto && <Image source={{ uri: `https://api-cont-auth.onrender.com/uploads/${foto}` }} style={{ width: 100, height: 100 }} />}
      <Button title="Salvar" onPress={enviar} />
    </View>
  );
}