import React from "react";
import CreateRecord from "./frontendComponents/CreateRecord";
import RecordTable from "./frontendComponents/RecordTable";
import { useEffect,useState } from "react";
import axios from "axios";



function App() {
  const [records, setRecords] = useState([]);//record store
  useEffect(() => {//backend se records ko fetch kar raha hain
    getRecords();
  },[])
  const getRecords = async () => {
    const response = await axios.get(
      "https://nodejs-rest-api-weld.vercel.app/health-records"
    );
    setRecords(response.data);
  };

  return (
    <div className=" w-screen min-h-[100vh] flex flex-col items-center gap-4 ">
      <h1 className="text-3xl font-bold  ">Health Dashboard</h1>
      <CreateRecord setRecords={setRecords} />
      <RecordTable records={records} setRecords={setRecords}/>

    </div>
  );
}

export default App;
