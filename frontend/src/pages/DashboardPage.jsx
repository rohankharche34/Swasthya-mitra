import React, { use, useEffect, useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { MicFill } from 'react-bootstrap-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


function DashboardPage({user}) {
  const[listning,setListining]=useState(false);
  const { transcript, browserSupportsSpeechRecognition,resetTranscript  } = useSpeechRecognition();
  const [texts,setTexts]=useState("");
  const [temp,setTemp]=useState("");
  const [suggestionVisible,setSuggestionVisible]=useState(false);
  const [responses,setResponses]=useState([]);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const[about,setAbout]=useState("");
  const[precaution,setPrecaution]=useState([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("disease");
  const [predicted, setPredicted] = useState(false);
  const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL || "http://localhost:5000";




  const suggenstions=["itching",
"skin rash",
"nodal skin eruptions",
"continuous sneezing",
"shivering",
"chills",
"joint pain",
"stomach pain",
"acidity",
"ulcers on tongue",
"muscle wasting",
"vomiting",
"burning micturition",
"spotting  urination",
"fatigue",
"weight gain",
"anxiety",
"cold hands and feets",
"mood swings",
"weight loss",
"restlessness",
"lethargy",
"patches in throat",
"irregular sugar level",
"cough",
"high fever",
"sunken eyes",
"breathlessness",
"sweating",
"dehydration",
"indigestion",
"headache",
"yellowish skin",
"dark urine",
"nausea",
"loss of appetite",
"pain behind the eyes",
"back pain",
"constipation",
"abdominal pain",
"diarrhoea",
"mild fever",
"yellow urine",
"yellowing of eyes",
"acute liver failure",
"fluid overload",
"swelling of stomach",
"swelled lymph nodes",
"malaise",
"blurred and distorted vision",
"phlegm",
"throat irritation",
"redness of eyes",
"sinus pressure",
"runny nose",
"congestion",
"chest pain",
"weakness in limbs",
"fast heart rate",
"pain during bowel movements",
"pain in anal region",
"bloody stool",
"irritation in anus",
"neck pain",
"dizziness",
"cramps",
"bruising",
"obesity",
"swollen legs",
"swollen blood vessels",
"puffy face and eyes",
"enlarged thyroid",
"brittle nails",
"swollen extremeties",
"excessive hunger",
"extra marital contacts",
"drying and tingling lips",
"slurred speech",
"knee pain",
"hip joint pain",
"muscle weakness",
"stiff neck",
"swelling joints",
"movement stiffness",
"spinning movements",
"loss of balance",
"unsteadiness",
"weakness of one body side",
"loss of smell",
"bladder discomfort",
"foul smell of urine",
"continuous feel of urine",
"passage of gases",
"internal itching",
"toxic look (typhos)",
"depression",
"irritability",
"muscle pain",
"altered sensorium",
"red spots over body",
"belly pain",
"abnormal menstruation",
"dischromic  patches",
"watering from eyes",
"increased appetite",
"polyuria",
"family history",
"mucoid sputum",
"rusty sputum",
"lack of concentration",
"visual disturbances",
"receiving blood transfusion",
"receiving unsterile injections",
"coma",
"stomach bleeding",
"distention of abdomen",
"history of alcohol consumption",
"fluid overload.1",
"blood in sputum",
"prominent veins on calf",
"palpitations",
"painful walking",
"pus filled pimples",
"blackheads",
"scurring",
"skin peeling",
"silver like dusting",
"small dents in nails",
"inflammatory nails",
"blister",
"red sore around nose",
"yellow crust ooze"
  ]




  useEffect(() => {
    if(transcript==null || transcript==""){
      setTexts(temp);
    }
    else{
      setTexts(temp+transcript);
    }

}, [transcript]);


useEffect(() => {
  if (texts.trim() === "") {
    setResponses([]);
    setSuggestionVisible(false);
    return;
  }

  const filteredSuggestion = suggenstions.filter((suggestion) =>
    suggestion.toLowerCase().includes(texts.toLowerCase())
  );

  setResponses(
    filteredSuggestion.length === 0
      ? ["no results"]
      : filteredSuggestion.slice(0, 10)
  );

  setSuggestionVisible(filteredSuggestion.length > 0);
}, [texts]);


  if (!browserSupportsSpeechRecognition) {
        return null;
    }
  const startListening = () => {
  setTemp(texts);
  resetTranscript();
  

  setListining(true);
  SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  
};

 const stopListening = () => {
  SpeechRecognition.stopListening();
  setListining(false);
 
  
};





  const handleSearch=(e)=>{
    const value=e.target.value;
    setTexts(value);
    setTemp(texts);
    resetTranscript();
   
  }

  const handleSelectSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom) && symptom !== "No results") {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setTemp("");
      setTexts("");
      resetTranscript();
      
      setSuggestionVisible(false);
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handlePredict = async () => {
  if (selectedSymptoms.length === 0) {
    setPrediction("Please select at least one symptom.");
    return;
  }

  setLoading(true);
  setShowResult(false); // reset animation
  setPrediction("");

  try {
    const res = await fetch(`${ML_API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: selectedSymptoms })
    });

    const data = await res.json();
    setPrediction(data.disease || "No prediction returned.");
    setAbout(data.about);
    setPrecaution(data.precautions);
    setActiveTab("disease");

    // small delay for smooth animation
    setTimeout(() => {
    setShowResult(true);
    setPredicted(true); // 🔥 triggers layout shift
    }, 200);

  } catch (e) {
    setPrediction("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
  setSelectedSymptoms([]);
};


  return (
    <Container fluid className="py-5">
      <Row className={`justify-content-center dashboard-row ${predicted ? "shifted" : ""}`}>


       <Col
          md={predicted ? 6 : 8}
          className={`transition-col search-col ${predicted ? "left" : "center"}`}
        >

          <Card className="shadow-sm border-0 p-4">
            <h2 className="mb-4 text-start">Symptom Checker</h2>

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Type or speak symptoms..."
                value={texts}
                onChange={handleSearch}
              />

              <Button variant="outline-primary" size="sm" onClick={startListening}>
                <MicFill className="me-1" />
                {listning ? "Listening..." : "Voice"}
              </Button>

              <Button variant="outline-danger" size="sm" onClick={stopListening}>
                Stop
              </Button>
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="selected-symptoms mt-3">
                {selectedSymptoms.map((symptom) => (
                  <span key={symptom} className="symptom-chip">
                    {symptom}
                    <span
                      className="chip-close"
                      onClick={() => handleRemoveSymptom(symptom)}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {suggestionVisible && (
              <div className="suggestion-box mt-3 p-2">
                {responses.map((s) => (
                  <div
                    key={s}
                    className="suggestion-item"
                    onClick={() => handleSelectSymptom(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* ✅ Predict Button */}
            <div className="mt-3">
              <Button
                variant="success"
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? "loading..." : "Predict"}
              </Button>
            </div>

          </Card>
        </Col>

        {/* Results */}
        {predicted && (
          <Col md={5} className="transition-col result-col">

  <Card className={`shadow-sm border-0 p-4 result-card ${showResult ? "show" : ""}`}>
    <h4 className="mb-3">Results</h4>

    {/* Nav Tabs */}
    {!loading && prediction && (
      <ul className="nav nav-pills mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "disease" ? "active" : ""}`}
            onClick={() => setActiveTab("disease")}
          >
            Disease
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "precaution" ? "active" : ""}`}
            onClick={() => setActiveTab("precaution")}
          >
            Precautions
          </button>
        </li>
      </ul>
    )}

    {/* Content */}
    <div className="result-box p-3">
      {loading && <p className="text-muted">Predicting...</p>}

      {!loading && showResult && (
        <>
          {activeTab === "disease" && (
            <p className="fw-bold text-success fade-in">{prediction}</p>
          )}

          {activeTab === "about" && (
            <p className="fade-in">{about}</p>
          )}

          {activeTab === "precaution" && (
            <ul className="fade-in">
              {precaution?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  </Card>
</Col>)}


      </Row>
    </Container>
  );

}

export default DashboardPage;