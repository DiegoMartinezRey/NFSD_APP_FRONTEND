import {
  faArrowDown,
  faArrowUp,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ButtonLight } from "../../components/Button";
import categoriesData from "../../data/categories.json";
import "./FilterActivity.css";

const FilterActivity = ({ getCategorySelection }) => {
  const [categories, setCategories] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/activities/all`
      );
      const activities = response.data;
      const categoriesNotRepeat = activities.reduce((acc, activity) => {
        if (acc.includes(activity.category)) {
          return acc;
        }
        acc.push(activity.category);
        return acc;
      }, []);
      setCategories(categoriesNotRepeat);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryIcon = (data) => {
    let foundIcon = {};
    foundIcon = categoriesData.find((category) => category.name === data);
    if (foundIcon) {
      return foundIcon.icon;
    }
    return null;
  };

  return (
    <>
      <div className="categoryFilterFlex">
        {categories.map((category, id) => (
          <div
            key={id}
            className="borderCategoriesIcons"
            onClick={() => getCategorySelection(category)}
          >
            <img
              className="categoriesIcons"
              key={id}
              src={getCategoryIcon(category)}
              alt=""
            />
          </div>
        ))}
      </div>
      <div className={`${isCollapsed ? "collapsed" : "expand"}`}>Estoy</div>

      <div className="filterFlex">
        <ButtonLight
          className="expandFiltersButton"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FontAwesomeIcon icon={faFilter} />
          <FontAwesomeIcon icon={isCollapsed ? faArrowDown : faArrowUp} />
        </ButtonLight>
      </div>
    </>
  );
};

export default FilterActivity;
