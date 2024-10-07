import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";

function RecordTable({ records, setRecords }) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [bt, setBt] = useState("");
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [searchId, setSearchId] = useState(""); 

  const deleteRecord = async (id) => {
    const response = await axios.delete(
      `https://nodejs-rest-api-weld.vercel.app/health-records/${id}`
    );
    if (response.status === 200) {
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== id)
      );
      toast({
        title: "Record Deleted",
      });
    }
  };

  const updateRecord = async (hr, bp, bt) => {
    const bpArr = bp.split("/");
    const systolic = parseInt(bpArr[0]);
    const diastolic = parseInt(bpArr[1]);
    const response = await axios.put(
      `https://nodejs-rest-api-weld.vercel.app/health-records/${currentId}`,
      {
        bloodPressure: { systolic, diastolic },
        heartRate: hr,
        bodyTemperature: bt,
        updatedAt: new Date(),
      }
    );
    if (response.status === 200) {
      setRecords((prevRecords) =>
        prevRecords.map((record) => {
          if (record._id === currentId) {
            return {
              ...record,
              bloodPressure: { systolic, diastolic },
              heartRate: hr,
              bodyTemperature: bt,
              updatedAt: new Date(),
            };
          }
          return record;
        })
      );
      toast({
        title: "Record Updated",
      });
      setCurrentId("");
      setBt("");
      setBp("");
      setHr("");
      setShowUpdate(false);
    }
  };

  // Filter records based on search input
  const filteredRecords = records.filter((record) =>
    record._id.toLowerCase().includes(searchId.toLowerCase())
  );//filtered array

  return (
    <>
      {/* Search input */}
      <div className="w-[95%] mx-auto my-4">
        <Input
          type="text"
          placeholder="Search by Record ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <Table className="w-[95%] mx-auto">
        <TableCaption>A list of Health Records.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Created At</TableHead>
            <TableHead >Id</TableHead>
            <TableHead>Heart Rate (bpm)</TableHead>
            <TableHead>Blood Pressure (Systolic/Diastolic)</TableHead>
            <TableHead>Body Temperature (°C)</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{new Date(record.createdAt).toLocaleString()}</TableCell>
                <TableCell>{record._id}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2 items-center">
                    <p>{record.heartRate}</p>
                    {showUpdate && currentId === record._id && (
                      <Input
                        type="number"
                        className="w-20"
                        value={currentId === record._id ? hr : record.heartRate}
                        onChange={(e) => setHr(e.target.value)}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2 items-center">
                    <p>
                      {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                    </p>
                    {showUpdate && currentId === record._id && (
                      <Input
                        type="text"
                        className="w-20"
                        value={currentId === record._id ? bp : record.bloodPressure}
                        onChange={(e) => setBp(e.target.value)}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2 items-center">
                    <p>{record.bodyTemperature}</p>
                    {showUpdate && currentId === record._id && (
                      <Input
                        type="number"
                        className="w-20"
                        value={currentId === record._id ? bt : record.bodyTemperature}
                        onChange={(e) => setBt(e.target.value)}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(record.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    {currentId !== record._id && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentId(record._id);
                          setShowUpdate(true);
                          setHr(record.heartRate);
                          setBp(
                            `${record.bloodPressure.systolic}/${record.bloodPressure.diastolic}`
                          );
                          setBt(record.bodyTemperature);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {currentId !== record._id && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          deleteRecord(record._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {showUpdate && currentId === record._id && (
                      <Button
                        variant="default"
                        onClick={async () => {
                          updateRecord(hr, bp, bt);
                        }}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default RecordTable;
