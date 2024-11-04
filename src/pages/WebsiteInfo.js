import React from "react";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import SystemArchitecture from "../components/SystemArchitecture/SystemArchitecture";
import ProjectAPIs from "./ProjectAPIsPage/ProjectAPIs";

function WebsiteInfo() {
  return (
      <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="stretch">
              <Grid item xs={12}>
                  <ProjectAPIs />
              </Grid>
              <Grid item xs={12}>
                  <SystemArchitecture />
              </Grid>
          </Grid>
      </Container>

  );
}

export default WebsiteInfo;
