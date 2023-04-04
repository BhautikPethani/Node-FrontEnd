import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { styles } from "../design-assets/styles";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import * as helper from "../services/helper";
import { Dropdown } from "react-native-element-dropdown";

const ManageTask = ({ route, navigation }) => {
  const taskStatus = [
    { label: "Pending", value: "-1" },
    { label: "Completed", value: "0" },
  ];
  const { workspace } = route.params;
  var [isSignInAlreadyCheck, setIsSignInAlreadyCheck] = useState(true);
  var [allTasks, setAllTasks] = useState(null);
  var [currentStatus, setCurrentStatus] = useState("-1");

  function getAllTasksToKanbanBoard(workspaceID, status) {
    console.log(workspaceID);
    fetch(helper.networkURL + "getTasks", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceID: workspaceID,
        status: status,
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
        // console.log(response);
        setAllTasks(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (isSignInAlreadyCheck) {
    // console.log("CALLED");
    helper.getAsync("user").then((data) => {
      if (data != undefined || data != "") {
        currentUser = data;
        getAllTasksToKanbanBoard(workspace._id, currentStatus);
      } else {
        navigation.replace("Login");
      }
    });
    setIsSignInAlreadyCheck(false);
  }

  const handleAddNewTask = async () => {
    var user = [];
    for (var a in workspace.participants) {
      user.push({
        id: workspace.participants[a],
        name: workspace.participants[a],
      });
      // console.log();
    } // console.log(response);
    // console.log(user);
    // navigation.navigate("New Workspace");

    fetch(helper.networkURL + "getTasksForDependant", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceID: workspace._id,
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
        // console.log(response[0].userName);
        var dependantTasks = [];
        for (var a in response) {
          dependantTasks.push({
            label: response[a].taskName,
            value: response[a]._id,
          });
          // console.log();
        } // console.log(response);
        console.log(user);
        // navigation.navigate("New Workspace");
        navigation.navigate("New Task", { workspace, user, dependantTasks });

        // setAllWorkspaces(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteTask = (task) => {
    console.log(task._id + task.taskName + task.dependantID);
    fetch(helper.networkURL + "deleteTask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskID: task._id,
        taskName: task.taskName,
        dependantID: task.dependantID,
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
        getAllTasksToKanbanBoard(workspace._id, currentStatus);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Item = ({ task }) => {
    return (
      <TouchableOpacity
      // onPress={() => navigation.navigate("More Details", item)}
      >
        <View style={[styles.item, styles.bgGrey]}>
          <View style={styles.cardDetails}>
            <Text style={[styles.title, styles.textBlack]}>
              {task.taskName}
            </Text>
            <Text style={[styles.description, styles.textBlack]}>
              {task.description}
            </Text>
            <Text style={[styles.description, styles.textBlack]}>
              <Text style={styles.bold}>Begin: </Text>
              {task.startDate}
            </Text>
            <Text style={[styles.description, styles.textBlack]}>
              <Text style={styles.bold}>Due: </Text>
              {task.endDate}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.delete}
            onPress={() => handleDeleteTask(task)}
          >
            <MaterialIcons name="delete-forever" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, styles.bgBlack]}>
      <View style={[styles.topNavigationContainer, styles.bgBlack]}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace("Dashboard");
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
            {workspace.workspaceName}
          </Text>
        </View>
      </View>
      <View style={[styles.tabContainer, styles.bgWhite]}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={taskStatus}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Pending"}
          value={currentStatus}
          onChange={(item) => {
            getAllTasksToKanbanBoard(workspace._id, item.value);
            setCurrentStatus(item.value);
          }}
        />
        <FlatList
          data={allTasks}
          renderItem={({ item }) => <Item task={item} />}
          keyExtractor={(item) => item._id}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          handleAddNewTask();
        }}
        style={styles.floatingActionButton}
      >
        <Ionicons name="add-outline" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ManageTask;
