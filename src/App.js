import React from 'react';
import './App.css';
import Notify from './notify/notify';
import { BrowserRouter as Router, Route } from 'react-router-dom';   
import Notifyshow from './Notifyshow';

import { useHistory } from "react-router-dom";

  


function App() {
  let history = useHistory();
  let data = [{"update":"70 new employees are shifted","timestamp":1596119688264,"id":1},{"update":"Time to take a Break, TADA!!!","timestamp":1596119686811,"id":2}]
  return (
    <>
    <div className="App">
      <Notify
  data={data}
  storageKey='notific_key'
  notific_key='timestamp'
  notific_value='update'
  heading='Notification Alerts'
  sortedByKey={false}
  showDate={true}
  size={64}
  color="yellow"
  // URLRedirect = "/notifyshow"
  // UniqueKey = "id"
/>
    </div>  
      <Router>
       <Route path="/notifyshow/:id" name="Notifyshow" component={Notifyshow}/>
      </Router>
     </>
  );
}

export default App;
