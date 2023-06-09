import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
// import {
//   signIn,
//   checkUserIsSignedInOrNot,
//   getAllUsers,
//   setWorkSpace,
// } from "../services/firebaseConfig";
import { styles } from "../design-assets/styles";
import * as helper from "../services/helper";
import { whiteColor } from "../design-assets/colors";
import { Dropdown } from "react-native-element-dropdown";
import MultiSelect from "react-native-multiple-select";

const CreateNewWorkspace = ({ route, navigation }) => {
  var { user } = route.params;
  console.log(user);
  var [isSignInAlreadyCheck, setIsSignInAlreadyCheck] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  if (isSignInAlreadyCheck) {
    // console.log("CALLED");
    helper.getAsync("user").then((data) => {
      console.log("1");
      if (data != undefined || data != "") {
      } else {
        navigation.replace("Login");
      }
    });
    setIsSignInAlreadyCheck(false);
  }

  // getAllUsers()
  //   .then((users) => {
  //     setUser(users);
  //   })
  //   .catch((err) => {});

  onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    // console.log(selectedItems);
  };

  handleAddWorkspace = () => {
    helper.getAsync("user").then((data) => {
      fetch(helper.networkURL + "createWorkspace", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceName: workspaceName,
          owner: data.userName,
          participants: selectedItems,
        }),
      })
        .then((res) => {
          // console.log(res.status);
          if (res.status == 200) {
            return res.json();
          } else {
            helper.alertBox({
              label: "Opps !",
              message: "Something Went Wrong !!",
            });
          }
        })
        .then((response) => {
          helper.alertBox(response);
          navigation.replace("Dashboard");
        })
        .catch((err) => {
          helper.alertBox({
            label: "Opps !",
            message: "Something went wrong",
          });
        });
      // setWorkSpace(
      //   workspaceName,
      //   helper.generateUsername(data.email),
      //   selectedItems
      // )
      //   .then((success) => {
      //     return helper.alertBox(success);
      //   })
      //   .catch((err) => {
      //     return helper.alertBox(err);
      //   });
    });
  };

  return (
    <View style={[styles.container, styles.bgBlack]}>
      <View style={[styles.topNavigationContainer, styles.bgBlack]}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.flex1}
          >
            <AntDesign name="left" style={[styles.backButtonText]} />
          </TouchableOpacity>
          <Text
            style={[
              styles.buttonText,
              styles.topNavigationBarTitle,
              styles.flex2,
            ]}
          >
            New Project
          </Text>
        </View>
      </View>
      <View style={[styles.tabContainer, styles.bgWhite]}>
        <TextInput
          style={[styles.textInput]}
          value={workspaceName}
          onChangeText={setWorkspaceName}
          placeholder="Enter Workspace Name"
        />
        <MultiSelect
          hideTags
          items={user}
          uniqueKey="id"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          styleDropdownMenuSubsection={styles.dropdown}
          selectText="Select Members"
          searchInputStyle={styles.textInput}
          searchInputPlaceholderText="Search members Here..."
          onChangeInput={(text) => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          submitButtonColor="#000"
          submitButtonText="Submit"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={
            () => handleAddWorkspace()
            // navigation.navigate("Step 2", { firstName, lastName, email })
          }
        >
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateNewWorkspace;
