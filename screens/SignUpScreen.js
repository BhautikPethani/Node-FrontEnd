import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import { registerNewUser } from "../services/firebaseConfig";
import { styles } from "../design-assets/styles";
import * as helper from "../services/helper";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // helper.getAsync("currentUser").then((data) => {
  //   console.log(data.email);
  // });

  const handleSignUp = async () => {
    if (firstName != "" && lastName != "") {
      if (password != "" && password == confirmPassword) {
        if (password.length >= 6) {
          if (helper.validateEmail(email)) {
            // var userName = helper.generateUsername(email);
            fetch(helper.networkURL + "signUp", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
              }),
            })
              .then((res) => res.json())
              .then((response) => {
                helper.alertBox(response);
              })
              .catch((err) => {
                helper.alertBox({
                  label: "Opps !",
                  message: "Something went wrong",
                });
              });
          } else {
            helper.alertBox({ label: "Opps !", message: "Invalid Email" });
          }
        } else {
          helper.alertBox({
            label: "Opps !",
            message: "Password must contain at least 6 character",
          });
        }
      } else {
        helper.alertBox({
          label: "Opps !",
          message: "Confirm Password must be same as password",
        });
      }
    } else {
      helper.alertBox({
        label: "Opps !",
        message: "Firstname and Lastname are mandatory !!",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SIGN UP</Text>
      <View style={styles.preLoginContainer}>
        <View style={styles.row}>
          <TextInput
            style={[styles.textInput, styles.inputFlex1]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Firstname"
          />
          <TextInput
            style={[styles.textInput, styles.inputFlex1]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Lastname"
          />
        </View>
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
        <TextInput
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          style={styles.textInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={
            () => handleSignUp()
            // navigation.navigate("Step 2", { firstName, lastName, email })
          }
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>
            Already have account? <Text style={styles.linkSpan}>SIGN IN</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;
