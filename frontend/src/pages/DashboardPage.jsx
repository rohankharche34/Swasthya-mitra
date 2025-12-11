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

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");




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
    setPrediction("");

    try {
      const res = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms
        })
      });

      const data = await res.json();
      setPrediction(data.disease || "No prediction returned.");
    } catch (e) {
      setPrediction("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">

        <Col md={6}>
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
                {loading ? <Spinner size="sm" /> : "Predict"}
              </Button>
            </div>

          </Card>
        </Col>

        {/* Results */}
        <Col md={5}>
          <Card className="shadow-sm border-0 p-4">
            <h4 className="mb-3">Results</h4>
            <div className="result-box p-3">
              {loading && <p className="text-muted">Predicting...</p>}
              {!loading && prediction && (
                <p className="fw-bold text-success">{prediction}</p>
              )}
            </div>
          </Card>
        </Col>

      </Row>
    </Container>
  );

}

export default DashboardPage;