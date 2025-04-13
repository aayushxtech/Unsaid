import React from "react";
import { Button, Container, Grid, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

const Home = () => {
  const ageGroups = [
    {
      title: "Kids",
      description: "Fun, simple intro to body, emotions, and safety",
      icon: <ChildCareIcon sx={{ fontSize: 60, color: "#3B82F6" }} />,
      color: "#DBEAFE", // light blue background
    },
    {
      title: "Teens",
      description: "Teen-focused: puberty, consent, identity, relationships",
      icon: <SchoolIcon sx={{ fontSize: 60, color: "#8B5CF6" }} />,
      color: "#EDE9FE", // light purple background
    },
    {
      title: "Adults",
      description:
        "Comprehensive guidance on intimacy, communication, and wellness",
      icon: <PersonIcon sx={{ fontSize: 60, color: "#10B981" }} />,
      color: "#D1FAE5", // light green background
    },
  ];

  const handleEmergency = () => {
    window.open("tel:112", "_blank");
    alert("Called 112");
  };
  return (
    <>
      <section
        id="Hero"
        className="bg-gradient-to-r from-blue-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text tracking-tight">
            UNSAID
          </div>
          <div className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
            Sex Education. Reimagined
          </div>
          <div className="text-lg md:text-xl text-gray-600 mb-10 mx-auto max-w-2xl">
            Empowering you with accurate, inclusive, and stigma-free
            knowledge—at your own pace.
          </div>
          <div id="cta-btn" className="mt-8">
            <Button className="!bg-blue-600 !text-white !font-medium !py-3 !px-8 !text-lg !rounded-lg !shadow-md hover:!bg-blue-700 !transition !duration-300 !normal-case">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 6,
              color: "#1F2937",
            }}
          >
            Caters to Various Age Groups
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {ageGroups.map((group, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: group.color,
                    }}
                  >
                    {group.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: 600 }}
                    >
                      {group.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {group.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ padding: 2, justifyContent: "center" }}
                  ></CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      <section id="emergency">
        <div className="bg-gradient-to-r from-red-50 to-red-100 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 4,
                color: "#B91C1C",
              }}
            >
              Emergency Help
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{ color: "#374151", mb: 6 }}
            >
              If you or someone you know is in immediate danger, please contact
              local authorities or a trusted individual.
            </Typography>
            <Button
              className="!bg-red-600 !text-white !font-medium !py-3 !px-8 !text-lg !rounded-lg !shadow-md hover:!bg-red-700 !transition !duration-300 !normal-case"
              onClick={handleEmergency}
            >
              Get Help Now
              
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
