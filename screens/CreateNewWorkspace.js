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
import MultiSelect from "react-native-multiple-select";

const CreateNewWorkspace = ({ navigation }) => {
  var [isSignInAlreadyCheck, setIsSignInAlreadyCheck] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [user, setUser] = useState([]);

  // getAllUsers()
  //   .then((users) => {
  //     setUser(users);
  //   })
  //   .catch((err) => {});

  fetch(helper.networkURL + "getAllUsernames", {
    method: "GET",
  })
    .then((res) => {
      // console.log(res.status);
      if (res.status == 200) {
        return res.json();
      } else {
        helper.alertBox({
          label: "Opps !",
          message: "Invalid Credentials !!",
        });
      }
    })
    .then((response) => {
      console.log(response);
      setAllWorkspaces(response);
    })
    .catch((err) => {
      console.log(err);
    });

  onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    // console.log(selectedItems);
  };

  // handleAddWorkspace = () => {
  //   helper.getAsync("currentUser").then((data) => {
  //     setWorkSpace(
  //       workspaceName,
  //       helper.generateUsername(data.email),
  //       selectedItems
  //     )
  //       .then((success) => {
  //         return helper.alertBox(success);
  //       })
  //       .catch((err) => {
  //         return helper.alertBox(err);
  //       });
  //   });
  // };

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
      <ScrollView style={[styles.tabContainer, styles.bgWhite]}>
        <TextInput
          style={[styles.textInput]}
          value={workspaceName}
          onChangeText={setWorkspaceName}
          placeholder="Enter Workspace Name"
        />
        {/* <MultiSelect
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
      /> */}
        <TouchableOpacity
          style={styles.button}
          onPress={
            () => handleAddWorkspace()
            // navigation.navigate("Step 2", { firstName, lastName, email })
          }
        >
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateNewWorkspace;
