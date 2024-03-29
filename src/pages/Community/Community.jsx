import axios from "axios";
import React, { useEffect, useState } from "react";
import Activities from "../../components/Activities/Activities";
import { ButtonDark, ButtonLight } from "../../components/Button";
import Map from "../../components/Map/Map";
import AddActivity from "../../container/AddActivity/AddActivity";
import FilterActivity from "../../container/FilterActivity/FilterActivity";
import { useAuth } from "../../context/Login";
import categories from "../../data/categories.json";
import "./Community.css";

function Community() {
  const [activities, setActivities] = useState([]);
  const [activitiesFilters, setActivitiesFilters] = useState({});
  const [category, setCategory] = useState({});
  const { user, loading } = useAuth();
  const [address, setAddress] = useState(null);
  const [mapView, setMapView] = useState(false);

  useEffect(() => {
    getAllActivities();
  }, [activitiesFilters, mapView]);

  const getAllActivities = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/activities/`,
        {
          params: {
            filters: activitiesFilters,
          },
        }
      );
      setActivities(response.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getIconImg = (type, data) => {
    let foundIcon = {};
    if (type === "categories") {
      foundIcon = categories.find((category) => category.name === data);
    }
    if (foundIcon) {
      return foundIcon.icon;
    }
    return null;
  };

  const bookUserInActivity = async (activity) => {
    const updatedParticipants = [...activity.participants, user.profileId];
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/activities/${activity._id}`,
        {
          participants: updatedParticipants,
        }
      );
      getAllActivities();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const cancelBookUserInActivity = async (activity) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/activities/${
          activity._id
        }/participants/${user.profileId}`
      );
      getAllActivities();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const deleteActivity = async (activity) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/activities/${activity._id}`
      );
      getAllActivities();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const userIsInActivity = (activity) => {
    return activity.participants
      .map((participant) => participant._id)
      .includes(user.profileId);
  };

  const getCategorySelection = (categorySelection) => {
    setActivitiesFilters(categorySelection);
  };

  return (
    <>
      <div className="flexCommunity">
        {user.role === "admin" ? (
          <AddActivity
            address={address}
            getAllActivities={getAllActivities}
            onAddressChange={(address) => setAddress(address)}
          />
        ) : (
          <></>
        )}
        <div className="showMapButtonsFlex">
          <ButtonDark onClick={() => setMapView(false)}>
            <h3 className="textInButtons">Show list of activities</h3>
          </ButtonDark>
          <ButtonLight onClick={() => setMapView(true)}>
            <h3 className="textInButtons">Show Map of activities</h3>
          </ButtonLight>
        </div>
        <div className={`mapContainer ${mapView ? "showMap" : "notShowMap"}`}>
          <Map address={address} mapView={mapView} activities={activities} />
        </div>
        <div
          className={`filtersActivitiesContainer ${
            mapView ? "notShowMap" : "showMap"
          }`}
        >
          <FilterActivity getCategorySelection={getCategorySelection} />
        </div>
        <div
          className={`activitiesContainer ${
            mapView ? "notShowMap" : "showMap"
          }`}
        >
          <Activities
            activities={activities}
            bookUserInActivity={bookUserInActivity}
            cancelBookUserInActivity={cancelBookUserInActivity}
            deleteActivity={deleteActivity}
            userIsInActivity={userIsInActivity}
            getIconImg={getIconImg}
          />
        </div>
      </div>
    </>
  );
}

export default Community;
