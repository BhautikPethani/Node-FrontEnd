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
import { Dropdown } from "react-native-element-dropdown";

const CreateNewTask = ({ route, navigation }) => {
  var { workspace, user, dependantTasks } = route.params;
  //   console.log(dependantTasks);
  var [isSignInAlreadyCheck, setIsSignInAlreadyCheck] = useState(true);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dependantID, setDependantID] = useState("-1");
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

  handleAddTask = () => {
    helper.getAsync("user").then((data) => {
      fetch(helper.networkURL + "createTask", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: taskName,
          description: taskDescription,
          startDate: startDate,
          endDate: endDate,
          participants: selectedItems,
          dependantID: dependantID,
          workspaceID: workspace._id,
          status: -1,
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
          navigation.replace("Manage Task", { workspace });
        })
        .catch((err) => {
          helper.alertBox({
            label: "Opps !",
            message: "Something went wrong",
          });
        });
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
            New Task
          </Text>
        </View>
      </View>
      <View style={[styles.tabContainer, styles.bgWhite]}>
        <TextInput
          style={[styles.textInput]}
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Enter Task Name"
        />
        <TextInput
          multiline
          style={[styles.textInput, { height: "15%" }]}
          value={taskDescription}
          onChangeText={setTaskDescription}
          placeholder="Enter task description"
          numberOfLines={5}
        />
        <TextInput
          style={[styles.textInput]}
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Start Date (MM-DD-YYYY)"
        />
        <TextInput
          style={[styles.textInput]}
          value={endDate}
          onChangeText={setEndDate}
          placeholder="Due Date (MM-DD-YYYY)"
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
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "black" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dependantTasks}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select dependant Task" : "..."}
          searchPlaceholder="Search..."
          value={dependantID}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setDependantID(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? "black" : "black"}
              name="Safety"
              size={20}
            />
          )}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={
            () => handleAddTask()
            // navigation.navigate("Step 2", { firstName, lastName, email })
          }
        >
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateNewTask;
