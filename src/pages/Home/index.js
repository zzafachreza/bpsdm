import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Linking,
  StatusBar,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import MyTerbaik from '../../components/MyTerbaik';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import 'intl';
import 'intl/locale-data/jsonp/en';
import MyTerbaik2 from '../../components/MyTerbaik2';
import MyTerbaik3 from '../../components/MyTerbaik3';
import MyDashboard from '../../components/MyDashboard';
import PushNotification from 'react-native-push-notification';

export default function Home({ navigation }) {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState('');
  const [tipe, setTipe] = useState('');
  const [company, setCompany] = useState({});







  useEffect(() => {


    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'mysukha_tri_sukma', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });




    getData('company').then(res => {
      setCompany(res);
    });

    getData('tipe').then(res => {
      setTipe(res);
    });

    getData('user').then(users => {
      console.log(users);
      setUser(users);


      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);

        axios
          .post('https://bpsdm.zavalabs.com/api/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });


    });

    return unsubscribe;
  }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;
  const _renderItem = ({ item, index }) => {
    return (
      <Image
        resizeMode="contain"
        source={{ uri: item.image }}
        style={{
          width: windowWidth,
          height: Math.round((windowWidth * 9) / 16),
        }}
      />
    );
  };

  const DataKategori = ({
    icon,
    nama,
    nama2,
    onPress,
    warna = colors.primary,
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          marginVertical: 5,
          backgroundColor: warna,
          padding: 5,
          borderRadius: 10,
          height: windowHeight / 5,
          elevation: 5,
          justifyContent: 'center',
        }}>
        <View>
          <Icon
            type="ionicon"
            name={icon}
            color={colors.white}
            size={windowWidth / 5}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.white,
              fontSize: windowWidth / 30,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama}
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.white,
              fontSize: windowWidth / 30,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama2}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView

      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      {/* <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor={'transparent'}
      /> */}

      <ScrollView>
        {/* bagian untuk point dan redeem */}

        <View
          style={{
            height: windowHeight / 6,
            marginBottom: 5,
            flexDirection: 'row',
            // borderBottomLeftRadius: 10,
            // borderBottomRightRadius: 10,
          }}>


          <View style={{ flex: 1, padding: 10, }}>

            <Text
              style={{
                fontSize: windowWidth / 30,
                color: colors.primary,
                fontFamily: fonts.secondary[600],
              }}>
              Selamat datang,
            </Text>
            <Text
              style={{
                fontSize: windowWidth / 25,
                color: colors.black,
                fontFamily: fonts.secondary[600],
              }}>
              {user.nama_lengkap}
            </Text>

          </View>
          <View
            style={{
              flex: 2,
              padding: 10,

              justifyContent: 'center',
              alignItems: 'center',

            }}>
            <Image
              source={require('../../assets/logo_dua.png')}
              style={{ width: 150, height: 70 }}
            />
            <Text
              style={{
                fontFamily: fonts.secondary[800],
                fontSize: windowWidth / 30,
                color: colors.primary,

              }}>
              Sistem Aplikasi layanan Pengaduan
            </Text>
            <Text
              style={{
                fontFamily: fonts.tertiary[600],
                fontSize: windowWidth / 30,
                color: colors.secondary,
                textAlign: 'center',
              }}>
              (SAPA) BPSDM
            </Text>
          </View>

        </View>





        {/* <MyCarouser /> */}

        {/* <MyDashboard tipe={tipe} /> */}

        <View
          style={{
            paddingHorizontal: 10,
          }}>

          <DataKategori
            warna={colors.primary}
            onPress={() => navigation.navigate('Pengaduan')}
            icon="camera-outline"
            nama="BUAT"
            nama2="PENGADUAN"
          />
          <DataKategori
            warna={colors.secondary}
            onPress={() => navigation.navigate('ListData')}
            icon="list-outline"
            nama="LIHAT"
            nama2="PENGADUANKU"
          />

          <DataKategori
            warna={colors.tertiary}
            onPress={() => {
              if (user.tipe == "ADMIN") {
                navigation.navigate('SurveyHasil')
              } else {
                navigation.navigate('Survey')
              }
            }}
            icon="apps"
            nama="INDEKS"
            nama2="KEPUASAN"
          />

        </View>

        {/*  */}

      </ScrollView>
    </SafeAreaView>
  );
}
