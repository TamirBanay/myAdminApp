import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangeSavedCities.css"; // נניח שה-CSS בקובץ נפרד
import { useRecoilState } from "recoil";
import {
  _modules,
  _logs,
  _citiesListIsOpen,
  _theCurrentMacAddress,
} from "../../services/atom";

function ChangeSavedCities({ changeCities }) {
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // הוספת ה-hook של useNavigate
  const [citiesListIsOpen, setCityListIsOpen] =
    useRecoilState(_citiesListIsOpen);
  const [theCurrentMacAddress, setTheCurrentMacAddress] = useRecoilState(
    _theCurrentMacAddress
  );

  const handleOpenCloseCitiesList = () => {
    setCityListIsOpen(!citiesListIsOpen);
  };

  const fetchCitiesList = async () => {
    try {
      const response = await fetch(
        "https://logsapi-o1jn.onrender.com/citiesjson"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCitiesList(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCitiesList();
  }, []);

  const handleCitySelection = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else if (selectedCities.length < 4) {
      setSelectedCities([...selectedCities, city]);
    }
  };
  const saveSelectedCities = async () => {
    if (selectedCities.length > 4) {
      alert("You can only select up to 4 cities.");
    } else {
      try {
        const response = await fetch(
          "https://logsapi-o1jn.onrender.com/api/saveCities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              macAddress: theCurrentMacAddress,
              cities: selectedCities,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCityListIsOpen(!citiesListIsOpen);
        console.log("Server response:", data);
        changeCities();
      } catch (error) {
        console.error("Error saving cities:", error);
      }
    }
  };

  const filteredCities = citiesList.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="change-saved-cities">
      <input
        type="text"
        placeholder="חפש עיר..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="cities-list">
        {filteredCities.map((city, index) => (
          <div key={index} className="city-item">
            <input
              type="checkbox"
              id={`city-${index}`}
              checked={selectedCities.includes(city)}
              onChange={() => handleCitySelection(city)}
            />
            <label htmlFor={`city-${index}`}>{city}</label>
          </div>
        ))}
      </div>
      <div className="buttons-save-and-close">
        <button className="save-button" onClick={saveSelectedCities}>
          שמור ערים
        </button>
        <button className="close-button" onClick={handleOpenCloseCitiesList}>
          סגור
        </button>
      </div>
    </div>
  );
}

export default ChangeSavedCities;
