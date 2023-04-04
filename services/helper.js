import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export var networkURL = "http://172.20.10.3:8081/";

export function validateEmail(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) return true;
  return false;
}

export function generateUsername(email) {
  var splitArray = email.split("@");
  return splitArray[0];
}

export function getAdminFromWorkspaceName(workspaceName) {
  var splitWorkspaceName = workspaceName.split("-+=");
  return splitWorkspaceName[1];
}

export function getUsernameFromWorkspaceKey(key) {
  var splitArray = key.split("-+=");
  return splitArray[1];
}

export function getParticipantsListInText(list) {
  var temp = "";
  console.log(list);
  for (let x of list) {
    temp += "@" + x + ", ";
  }
  return temp;
}

export function alertBox({ label, message }) {
  return Alert.alert(label, message, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
}

export async function setAsync(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

export async function getAsync(key) {
  return new Promise(async (resolve, reject) => {
    try {
      await AsyncStorage.getItem(key).then((data) => {
        resolve(JSON.parse(data));
      });
      // console.log(JSON.parse(data));
    } catch (error) {
      reject(error);
    }
  });
}
