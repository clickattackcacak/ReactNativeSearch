/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import RNFB from 'react-native-fetch-blob';

export default class App extends Component<{}> {

  state = {
    searchTxt: '',
    foundObjs: [],
    visibleSearch: false
  }

  componentWillMount() {
    this.getDataFromNet();
  }

  searchName(name) {
    let lName = name.toLowerCase();
    return new Promise((resolve, reject) => {
      let a = global.netData.results.filter(x =>
        x.name.first.toLowerCase().includes(lName) ||
        x.name.last.toLowerCase().includes(lName) ||
        x.gender.toLowerCase().includes(lName) ||
        x.name.title.toLowerCase().includes(lName)
      );
      resolve(a)
    })
  }

  getDataFromNet() {
    let netAPI = 'https://randomuser.me/api/?results=4000';
    fetch(netAPI)
      .then((res) => res.json())
      .then((result) => {
        global.netData = result;
        this.setState({ visibleSearch: true });
        console.log(global.netData.results);
      })
      .catch(err => console.error(err));
  }

  createResultList = (txt) => {
    this.searchName(txt)
      .then((res) => {
        this.setState({ foundObjs: res });
      });
  }

  renderList = (data) => {
    let rlt = [];
    if (data)
      return data.map(element =>
        <View key={element.cell+element.email}>
          <Image
            style={{ height: 72, width: 72, marginRight: 20 }}
            source={{ uri: element.picture.medium }}
            key={element.cell+element.phone+element.email}
          />
          <Text style={{ paddingBottom: 15, fontSize: 20 }} key={element.phone+element.email}>{element.name.first} {element.name.last}</Text>
        </View>
      )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}> Search {this.state.searchTxt}! </Text>
        {this.state.visibleSearch &&
          <TextInput onChangeText={(txt) => this.createResultList(txt)} placeholder=' >' />}
        <ScrollView>
          {this.renderList(this.state.foundObjs)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
