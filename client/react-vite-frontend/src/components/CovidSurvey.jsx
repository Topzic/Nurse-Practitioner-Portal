import React, { useState } from 'react';

const Checklist = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [percentage, setPercentage] = useState(0);

  const symptomsList = [
    { name: 'Fever', weight: 20 },
    { name: 'Cough', weight: 25 },
    { name: 'Shortness of breath', weight: 15 },
    { name: 'Fatigue', weight: 10 },
    { name: 'Muscle or body aches', weight: 10 },
    { name: 'Headache', weight: 5 },
    { name: 'New loss of taste or smell', weight: 15 },
    { name: 'Sore throat', weight: 5 },
    { name: 'Congestion or runny nose', weight: 5 },
    { name: 'Nausea or vomiting', weight: 5 },
    { name: 'Diarrhea', weight: 5 }
  ];

  const handleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(selected => selected !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const calculatePercentage = () => {
    let totalWeight = 0;
    selectedItems.forEach(item => {
      const symptom = symptomsList.find(symptom => symptom.name === item);
      if (symptom) {
        totalWeight += symptom.weight;
      }
    });

    const totalPercentage = (totalWeight / 100) * 100;
    setPercentage(totalPercentage);
  };

  const handleSubmit = () => {
    calculatePercentage();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checklist of Common Signs and Symptoms</h2>
      <form>
        {symptomsList.map((item, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={item.name}
              value={item.name}
              checked={selectedItems.includes(item.name)}
              onChange={() => handleSelectItem(item.name)}
            />
            <label className="form-check-label" htmlFor={item.name}>{item.name}</label>
          </div>
        ))}
        <button className="btn btn-primary mt-3" type="button" onClick={handleSubmit}>Submit Choices</button>
      </form>
      {percentage > 0 && (
        <div className="mt-4">
          <h3>Selected Symptoms:</h3>
          <ul className="list-group">
            {selectedItems.map((item, index) => (
              <li key={index} className="list-group-item">{item}</li>
            ))}
          </ul>
          <h3 className="mt-3 text-center">Percentage Chance of Having COVID-19: {parseInt(percentage).toFixed(0)}%</h3>
          {percentage > 49 && (
            <h5 className="mt-3 text-center text-danger">
                Based on the symptoms you have selected, there is a high likelihood that you may have COVID-19. We recommend taking immediate action and notifying your nurse. Consider sending an <a href="/createalert">emergency alert</a> to ensure prompt attention and care.
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default Checklist;
