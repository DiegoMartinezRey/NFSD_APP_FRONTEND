import { faBook, faCancel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Login";
import "./Community.css";

function Community() {
  const [activities, setActivities] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    getAllActivities();
  }, []);

  const getAllActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3001/activities/");
      setActivities(response.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const bookUserInActivity = async (activity) => {
    const updatedParticipants = [...activity.participants, user.profileId];
    try {
      await axios.put(`http://localhost:3001/activities/${activity._id}`, {
        participants: updatedParticipants,
      });
      getAllActivities();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const cancelBookUserInActivity = async (activity) => {
    try {
      await axios.delete(
        `http://localhost:3001/activities/${activity._id}/participants/${user.profileId}`
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

  return (
    <>
      <div className="flexCommunity">
        <div className="activitiesContainer">
          {activities.map((activity, id) => (
            <div key={id} className="flexActivity">
              <div className="activityCategory">
                <div className="styleCategory">.</div>
                <div className="descriptionText">{activity.category}</div>
              </div>
              <div className="divisionActivity"></div>
              <div className="activityContainer">
                <div className="titleText">{activity.title}</div>
                <div className="descriptionText">{activity.description}</div>
                <div className="descriptionText">Date: {activity.date}</div>
                <div className="progressContainer">
                  <div
                    className="progressBar"
                    style={{
                      width: `${
                        (activity.participants.length / activity.capacity) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div>
                  {activity.participants.length}/{activity.capacity}
                </div>
                <div className="flexParticipants">
                  <div>Participants:</div>
                  {activity.participants.map((participant, index) => (
                    <span key={index}>{participant.name}</span>
                  ))}
                </div>
              </div>
              <div className="flexButtons">
                <button
                  className={`buttonBookStyle ${
                    userIsInActivity(activity)
                      ? "disabledBookButton"
                      : "bookButton"
                  }`}
                  disabled={userIsInActivity(activity)}
                  onClick={() => bookUserInActivity(activity)}
                >
                  <FontAwesomeIcon icon={faBook} />
                </button>
                <button
                  className={`buttonBookStyle ${
                    !userIsInActivity(activity)
                      ? "disabledBookButton"
                      : "cancelBookButton"
                  }`}
                  disabled={!userIsInActivity(activity)}
                  onClick={() => cancelBookUserInActivity(activity)}
                >
                  <FontAwesomeIcon icon={faCancel} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Community;
