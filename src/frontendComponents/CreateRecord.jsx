import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"
import axios from "axios"




function CreateRecord({ setRecords }) {
  const [date, setDate] = useState("");
  const [bt, setBt] = useState("");
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const {toast}=useToast();

  const addRecord = async () => {
    if (!date || !bt || !bp || !hr) {
      alert("Please fill all the fields");
      return;
    }
    const bpArr = bp.split("/");
    const systolic = parseInt(bpArr[0]);
    const diastolic = parseInt(bpArr[1]);
    try {
      const response = await axios.post(
        "https://nodejs-rest-api-weld.vercel.app/health-records",
        {
          createdAt: date,
          updatedAt: new Date(),
          bloodPressure: { systolic, diastolic },
          heartRate: hr,
          bodyTemperature: bt,
        }
      );
      if (response.status === 200) {
        setDate("");
        setBt("");  
        setBp("");
        setHr("");
        toast({
            title: "Success",
            description: "Record added successfully",
          })
          setRecords((prevRecords) => [...prevRecords, response.data]);//
      }
      else{
        alert("internal server error");
      }
    } catch (error) {
      alert("Error saving record");
      console.log(error);
    }

  };
  
  return (
    <Card className="w-[98%] pb-4">
      <CardHeader>
        <CardTitle>Add New Health Record</CardTitle>
      </CardHeader>
      <CardContent className="w-full h-full  flex flex-col gap-5  py-2">
        <div className="w-full flex gap-4">
          <div className="grid w-1/2 items-center gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </div>
          <div className="grid w-1/2   items-center gap-2">
            <Label htmlFor="bt">Body Temperature (°C)</Label>
            <Input
              type="number"
              id="bt"
              onChange={(e) => setBt(e.target.value)}
              value={bt}
            />
          </div>
        </div>
        <div className="w-full flex gap-4">
          <div className="grid w-1/2 items-center gap-2">
            <Label htmlFor="bp">Blood Pressure (systolic/Dystolic)</Label>
            <Input
              type="text"
              id="bp"
              placeholder="120/80"
              onChange={(e) => setBp(e.target.value)}
              value={bp}
            />
          </div>
          <div className="grid w-1/2   items-center gap-2">
            <Label htmlFor="hr">Heart Rate(bpm)</Label>
            <Input
              type="number"
              id="hr"
              onChange={(e) => setHr(e.target.value)}
              value={hr}
            />
          </div>
        </div>

        <Button
          variant="default"
          className="w-[fit-content]"
          onClick={addRecord}
        >
          Add Record
        </Button>
      </CardContent>
    </Card>
  );
}

export default CreateRecord;
