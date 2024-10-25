import React, {useEffect, useState} from "react";
import {
  Row,
  Col,
} from "reactstrap";

import { Container, Title, Card, Button, NavLink, Text } from "@mantine/core";

import "bootstrap/dist/css/bootstrap.min.css";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { getCookie, meeting_view, get_church_data, isSuperUser } from "../../api";
import AppSidebar from "../../components/appSidebar";
import MeetingCard from "./components/MeetingCard";

/**
 * "Schedule" page of application displays meetings.
 */
const Schedule = () => {
  const [meetings, setMeetings] = useState("");
  const [allMeetings, setAllMeetings] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [churchDropdownOptions,setChurchDropdownOptions] = useState(['other']);
  const [selectedChurchDropdownOption,setSelectedChurchDropdownOption] = useState();
  /*
   * mustGetMeetings is a boolean useEffect() trigger - useful to
   * have a single trigger for the API call to avoid filling
   * useEffect's dependency array with booleans and complicating
   * its execution conditional.
   */
  const [mustGetMeetings, setMustGetMeetings] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      const response =
        await meeting_view()
        .catch((error) => {
          console.log(error)
        });
        setAllMeetings(response.data);
      const privilege=getCookie("priv");
      if(privilege ==1){
        // if(selectedChurchDropdownOption==null){
        let church=selectedChurchDropdownOption;
        let wantedMeetingData=[];
        let tempMeetingsData=response.data;
        for (let i = 0; i < tempMeetingsData.length; i++) {
          console.log(tempMeetingsData[i].church,church);
          if (tempMeetingsData[i].church+"" === church) {
              wantedMeetingData.push(tempMeetingsData[i]);
          }
      } 
      setMeetings(wantedMeetingData)
        
    // }
      } else if(privilege ==2){
        const church =getCookie("church");
        let wantedMeetingData=[];
        let tempMeetingsData=response.data;
        for (let i = 0; i < tempMeetingsData.length; i++) {
          if (tempMeetingsData[i].church+"" === church) {
              wantedMeetingData.push(tempMeetingsData[i]);
          }
      } 
      setMeetings(wantedMeetingData)
      }else if(privilege ==3){
        const church =getCookie("church");
        const id =getCookie("user-id");
        let wantedMeetingData=[];
        let tempMeetingsData=response.data;
        for (let i = 0; i < tempMeetingsData.length; i++) {
          if (tempMeetingsData[i].created_by+"" === id+"") {
              wantedMeetingData.push(tempMeetingsData[i]);
          }
      } 
      setMeetings(wantedMeetingData)
      }

      setMustGetMeetings(false);
      setIsLoading(false);
    }

    if (mustGetMeetings) {
      fetchMeetings();
    }

    fetchChurchDropdownData();

    

  }, [mustGetMeetings, selectedChurchDropdownOption]);


  const fetchChurchDropdownData=()=>{

    get_church_data()
            .then((req) => {
                const churchData = req.data;
                
                
                let tempDropdownData=[];
                churchData.forEach(x => {
                  tempDropdownData.push({
                    "id":x.id,
                    "name":x.name
                  })
                  });
                setChurchDropdownOptions(tempDropdownData);
                
            })
            .catch((error) => {
                console.log(error);
            });
  }

  const newMeeting = () => {
    navigate(
      "/schedule/meeting",
      {
        state: {
          meeting: null,
          clearForm: true
        }
      }
    );
  }

  const OnChurchDropdownOptionChange=(selectedIndex)=>{
      let wantedMeetingData=[];
        for (let i = 0; i < allMeetings.length; i++) {
          console.log(allMeetings[i].church,selectedIndex);
          if (allMeetings[i].church+"" === selectedIndex+"") {
              wantedMeetingData.push(allMeetings[i]);
          }
      } 
      setMeetings(wantedMeetingData)
  }

  return (
    <div style={{display: 'flex'}}>
      <AppSidebar />
      <div style={{position: "relative", left: "15%",width:"100%", height:"94vh"}} className="my-3">
        <Card className="my-card  my-card-height schedule-card" style={{width:"80%"}}>
          <Title order={5} className=" p-3 card-head" style={{ display: "flex", justifyContent: "space-between" }}>
          {getCookie("priv")==="1" &&<Dropdown
                className="custom-dropdown" 
                  options={churchDropdownOptions.map((x)=>x.name)} 
                  onChange={
                    (selectedValue) => {
                      const selectedIndex = churchDropdownOptions.findIndex(option => option.name === selectedValue.value);
                      setSelectedChurchDropdownOption(churchDropdownOptions[selectedIndex].id);
                      OnChurchDropdownOptionChange(churchDropdownOptions[selectedIndex].id);

                    }}
                   placeholder="Select an church" 
                   
                   />}
            <Row>
            
              {!isSuperUser() && <IconButton onClick={newMeeting}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>}
            </Row>
            <div></div>
          </Title>
          <Text className="p-3 schedule-card-body">
            {
              isLoading ?
              <CircularProgress /> :
              <Row className="equal-height">
                {
                  meetings.map(
                    (meeting) => (
                      <Col className="col d-flex"key={meeting.id} xs={12} md={6} lg={4}>
                        <MeetingCard
                          meeting={meeting}
                          mustGetMeetings={mustGetMeetings}
                          setMustGetMeetings={setMustGetMeetings}
                        />
                      </Col>
                    )
                  )
                }
              </Row>
            }
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;

