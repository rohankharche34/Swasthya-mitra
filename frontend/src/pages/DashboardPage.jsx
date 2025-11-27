import React, { use, useEffect, useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { MicFill } from 'react-bootstrap-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


function DashboardPage({user}) {
  const[listning,setListining]=useState(false);
  const { transcript, browserSupportsSpeechRecognition,resetTranscript  } = useSpeechRecognition();
  const [texts,setTexts]=useState("");
  const [temp,setTemp]=useState("");

  useEffect(() => {
    if(transcript==null || transcript==""){
      setTexts(temp);
    }
    else{
      setTexts(temp+transcript);
    }
}, [transcript,temp]);

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









  return (
  <Container fluid className="py-5">
    <Row className="justify-content-center">
      
      {/* LEFT SIDE – Search + Suggestions */}
      <Col md={6}>

        <Card className="shadow-sm border-0 p-4">
          <h2 className="mb-4 text-start">Symptom Checker</h2>

          {/* SEARCH ROW */}
          <div className="d-flex align-items-center gap-2">

            {/* INPUT */}
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 'I have a fever, headache, and a sore throat...'"
              value={texts}
              onChange={(e) => setTexts(e.target.value)}
            />

            {/* BUTTONS ON RIGHT */}
            <div className="d-flex gap-2">

              <Button variant="success" size="sm">
                Predict
              </Button>

              <Button variant="outline-primary" size="sm" onClick={startListening}>
                <MicFill className="me-1" />
                {listning ? "Listening..." : "Voice"}
              </Button>

              <Button variant="outline-danger" size="sm" onClick={stopListening}>
                Stop
              </Button>

            </div>

          </div>

          {/* SUGGESTIONS BOX */}
          <div className="mt-3 p-3 rounded shadow-sm suggestion-box">
            <p className="text-muted m-0">Suggestions will appear here...</p>
          </div>

        </Card>

      </Col>

      {/* RIGHT SIDE – RESULT BOX */}
      <Col md={5}>
        <Card className="shadow-sm border-0 p-4">
          <h4 className="mb-3">Results</h4>
          <div className="result-box">
            <p className="text-muted">Predicted disease or details will appear here...</p>
          </div>
        </Card>
      </Col>

    </Row>
  </Container>
);

}

export default DashboardPage;