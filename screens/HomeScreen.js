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
} from "@expo/vector-icons";
import * as helper from "../services/helper";
import { whiteColor } from "../design-assets/colors";
// import {
//   checkUserIsSignedInOrNot,
//   signOutCurrentUser,
//   getWorkspaces,
// } from "../services/firebaseConfig";

const HomeScreen = ({ navigation }) => {
  var [isSignInAlreadyCheck, setIsSignInAlreadyCheck] = useState(true);
  var currentUser = null;
  var [allWorkspaces, setAllWorkspaces] = useState(null);

  function getAllWorkspacesToDashboard(userName) {
    // console.log("TEST 2");

    fetch(helper.networkURL + "allWorkspaces", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
      }),
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
  }

  if (isSignInAlreadyCheck) {
    // console.log("CALLED");
    helper.getAsync("user").then((data) => {
      if (data != undefined || data != "") {
        currentUser = data;
        getAllWorkspacesToDashboard(currentUser.userName);
      } else {
        navigation.replace("Login");
      }
    });
    setIsSignInAlreadyCheck(false);
  }

  const handleSignOut = async () => {
    // helper.getAsync("user").then((data) => {
    //   if (data != undefined || data != "") {
    //     getAllWorkspacesToDashboard(data.userName);
    //   } else {
    //     navigation.replace("Login");
    //   }
    // });
    helper.setAsync("user", "");
    navigation.replace("Login");
  };

  const handleAddNewWorkspace = async () => {
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
        // console.log(response[0].userName);
        var user = [];
        for (var a in response) {
          user.push({
            id: response[a].userName,
            name: response[a].userName,
          });
          // console.log();
        } // console.log(response);
        console.log(user);
        // navigation.navigate("New Workspace");
        navigation.navigate("New Workspace", { user });

        // setAllWorkspaces(response);
      })
      .catch((err) => {
        console.log(err);
      });

    // await signOutCurrentUser()
    //   .then((data) => {
    //     // console.log(data);
    //     helper.setAsync("currentUser", "");
    //     navigation.replace("Login");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const Item = ({ workspace }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Manage Task", { workspace })}
      >
        <View style={styles.item}>
          <View style={styles.cardDetails}>
            <Text style={styles.title}>{workspace.workspaceName}</Text>
          </View>
          {/* <TouchableOpacity style={styles.delete} onPress={() => {}}>
              <MaterialIcons name="delete-forever" size={30} color="white" />
            </TouchableOpacity> */}
          <MaterialIcons
            name="keyboard-arrow-right"
            size={35}
            color="white"
            style={styles.rightArrow}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, styles.bgBlack]}>
      <View style={[styles.topNavigationContainer, styles.bgBlack]}>
        <View style={styles.row}>
          <Text style={[styles.buttonText, styles.topNavigationBarTitle]}>
            Choose Projects
          </Text>
          <TouchableOpacity
            onPress={() => {
              handleSignOut();
            }}
          >
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color={whiteColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.tabContainer, styles.bgWhite]}>
        <FlatList
          data={allWorkspaces}
          renderItem={({ item }) => <Item workspace={item} />}
          keyExtractor={(item) => item._id}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          handleAddNewWorkspace();
        }}
        style={styles.floatingActionButton}
      >
        <Ionicons name="add-outline" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
