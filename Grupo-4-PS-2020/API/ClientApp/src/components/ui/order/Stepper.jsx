import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import {
  ButtonBase,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import ShippingForm from "./ShippingForm";
import Details from "./Details";
import { useHistory } from "react-router";
import { apiAxios } from "../../../config/axios";
import { SellerComments } from "./SellerComments";
import { useShippingCalculate } from "../../../helpers/shippingCalculate";
import PaymentMethod from "./PaymentMethod";

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Formulario de envio",
    "Muestro costos y detalles (peso, envio, prod)",
    "Metodo pago",
    "Comentarios y send",
  ];
}

export default function StepperOrder() {
  const history = useHistory();

  //Si no esta logeado no debe poder entrar a esta pagina
  const token = localStorage.getItem("token");
  if (token === null) {
    history.push("/");
  }

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const [error, seterror] = useState(false);

  //States shipping form
  const [street, setstreet] = useState("");
  const [number, setnumber] = useState("");
  const [floor, setfloor] = useState("");
  const [dep, setdep] = useState("");
  const [postalcode, setpostalcode] = useState("");
  const [locality, setlocality] = useState("");
  const [province, setprovince] = useState("");

  //States paymentMethod
  const [paymentmethod, setpaymentmethod] = useState("");
  const [typedoc, settypedoc] = useState("");
  const [doc, setdoc] = useState("");
  const [cardnumber, setcardnumber] = useState("");
  const [expiry, setexpiry] = useState("");
  const [cvc, setcvc] = useState("");
  const [paydone, setpaydone] = useState(false);

  //Se pone el idDirection en order de localstorage
  const addDirectionLocalStorage = (iddirec) => {
    var orderls = localStorage.getItem("order");
    orderls = JSON.parse(orderls);

    const direction = {
      idDirection: iddirec,
    };
    orderls.direction = direction;

    localStorage.setItem("order", JSON.stringify(orderls));
  };

  //Se pone el idPayment en order de localstorage
  const addPaymentMethodLocalStorage = (idpm) => {
    var orderls = localStorage.getItem("order");
    orderls = JSON.parse(orderls);

    const payment = {
      idPayment: idpm,
    };
    orderls.payment = payment;

    localStorage.setItem("order", JSON.stringify(orderls));
  };

  const createDirectionAPI = (direc) => {
    apiAxios
      .post("/direction/createDirection", direc, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
          "Access-Control-Allow-Headers":
            "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then(({ data }) => {
        localStorage.setItem("direction", JSON.stringify(data)); //Agrego la dire al ls

        addDirectionLocalStorage(data.idDirection);
      })
      .catch((error) => console.log(error));
  };

  const getPaymentMethodsAPI = async () => {
    await apiAxios
      .get("/payment/allPayment", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
          "Access-Control-Allow-Headers":
            "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then(({ data }) => {
        const payment = {
          name: paymentmethod,
        };

        if (data.length === 0) {
          //Si la bd esta vacia
          createPaymentMethodAPI(payment);
        } else {
          const paymentmethodDB = data.filter((p) => p.name === paymentmethod);

          if (paymentmethodDB.length !== 0) {
            //Si existe en la bd
            addPaymentMethodLocalStorage(paymentmethodDB[0].idPayment);
          } else {
            //Si no se encuentra crear paymentmethod
            createPaymentMethodAPI(payment);
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const createPaymentMethodAPI = (pm) => {
    apiAxios
      .post("/payment/createPayment", pm, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
          "Access-Control-Allow-Headers":
            "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then(({ data }) => {
        console.log(data);

        //Guarda id en ls order
        addPaymentMethodLocalStorage(data.idPayment);
      })
      .catch((error) => console.log(error));
  };

  const handleNext = () => {
    //Si esta en ShippingForm
    switch (activeStep) {
      case 2: //ShippingForm
        if (
          street === "" ||
          number === "" ||
          postalcode === "" ||
          locality === "" ||
          province === ""
        ) {
          seterror(true);
          return;
        }
        seterror(false);

        const direction = {
          street,
          number: parseInt(number, 10),
          flat: parseInt(floor, 10),
          apartment: dep,
          postalCode: parseInt(postalcode, 10),
          location: locality,
          province,
        };

        createDirectionAPI(direction);
        break;
      case 1: //Details
        break;
      case 0: //PaymentMethod
        if (
          paymentmethod.length === 0 ||
          ((paymentmethod === "creditcard" || paymentmethod === "debitcard") &&
            (typedoc.length === 0 || doc.length === 0)) ||
          ((paymentmethod === "creditcard" || paymentmethod === "debitcard") &&
            (cardnumber.length === 0 ||
              expiry.length === 0 ||
              cvc.length === 0)) ||
          (paymentmethod === "mercadopago" && paydone === false)
        ) {
          seterror(true);
          return;
        }
        seterror(false);

        //Get paymentmethods de la bd
        getPaymentMethodsAPI();

        break;
      case 3: //SellerComments
        break;
      default:
        break;
    }

    //setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 2:
        return (
          <ShippingForm
            street={street}
            setstreet={setstreet}
            number={number}
            setnumber={setnumber}
            floor={floor}
            setfloor={setfloor}
            dep={dep}
            setdep={setdep}
            postalcode={postalcode}
            setpostalcode={setpostalcode}
            locality={locality}
            setlocality={setlocality}
            province={province}
            setprovince={setprovince}
            error={error}
          />
        );
      case 1:
        return <Details postalcode={postalcode} province={province} />;
      case 0:
        return (
          <PaymentMethod
            paymentmethod={paymentmethod}
            setpaymentmethod={setpaymentmethod}
            typedoc={typedoc}
            settypedoc={settypedoc}
            doc={doc}
            setdoc={setdoc}
            error={error}
            seterror={seterror}
            cardnumber={cardnumber}
            setcardnumber={setcardnumber}
            expiry={expiry}
            setexpiry={setexpiry}
            cvc={cvc}
            setcvc={setcvc}
            paydone={paydone}
            setpaydone={setpaydone}
          />
        );
      case 3:
        return <SellerComments />;
      default:
        return "Unknown stepIndex";
    }
  }

  return (
    <Container maxWidth={"lg"}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={9}>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed
                </Typography>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            ) : (
              <div>
                <Typography component={"span"} className={classes.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
                <div className="pb-5 pt-5" style={{ textAlign: "right" }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    Atras
                  </Button>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#007A9A" }}
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1
                      ? "Finalizar"
                      : "Siguiente"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
