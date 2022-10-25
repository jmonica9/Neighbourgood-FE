import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { BACKEND_URL } from "../../constants";
import { Button, Modal, Grid, Group } from "@mantine/core";
import { UserContext } from "../../App";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CURRENCY = "SGD";
const amountInDollars = (amount) => parseInt(amount * 100);
const stripe = loadStripe(
  "pk_test_51LtpoUD8YIibmjV3cftm7kCT6kYkMOV1PgTh0iRW7deqgUbhiJySG443S0Ir6jrdAVRGIMQgphnLdYe5sFEUQYYq00dU6tQJcT"
);

export default function ClaimDeposit(props) {
  const options = { showIcon: true, iconStyle: "default" };
  const navigate = useNavigate();

  const addBalance = async () => {
    let adding = await axios.post(`${BACKEND_URL}/payment/addBalance`);
  };

  const paymentSuccess = () => {
    toast.success("Claim successful", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };
  const paymentError = () => {
    toast.error("Claim error!", {
      position: "top-right",
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };

  const claimDeposit = async () => {
    let accountId = JSON.parse(localStorage.getItem("account"));
    console.log(accountId.data.account.id);
    const response = await axios.post(`${BACKEND_URL}/payment/claimDeposit`, {
      accountId: accountId.data.account.id,
      amount: amountInDollars(props.amount),
    });
    if (response.status === 200) {
      const payment = await axios.put(
        `${BACKEND_URL}/payment/${props.listing._id}`,
        { status: "Deposit Returned" }
      );
      console.log(payment);
      props.updatePaymentStatus();
      props.refresh();
      return paymentSuccess();
    } else {
      return paymentError();
    }
    console.log(response);
  };

  const createStripeAccount = async () => {
    const account = await axios.post(`${BACKEND_URL}/payment/account`);
    console.log(account);
    localStorage.setItem("account", JSON.stringify(account));
    if (account.status === 200) {
      window.location.assign(account.data.accountLink.url);
    }
  };

  const CardForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    // const options = useOptions();

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }
      //create payment method and cardtoken
      // const newPaymentMethod = await axios.post(
      //   `${BACKEND_URL}/payment/new/paymentMethod`,
      //   {
      //     type: "card",
      //     card: elements.getElement(CardElement),
      //   }
      // );
      // console.log(newPaymentMethod.data);

      const newPaymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      console.log("PaymentMethod", newPaymentMethod);

      if (newPaymentMethod) {
        const cardElement = elements.getElement(CardElement);
        let token = await stripe.createToken(cardElement);
        console.log("CardToken", token);
        const newCustomer = await axios.post(
          `${BACKEND_URL}/payment/customer`,
          {
            source: token.id,
            email: "test@test.com",
          }
        );
        console.log("Customer", newCustomer);
        const attachPaymentMethod = axios.post(
          `${BACKEND_URL}/payment/paymentMethod`,
          {
            paymentMethodId: newPaymentMethod.paymentMethod.id,
            customerId: newCustomer.data.success.id,
          }
        );
        console.log(attachPaymentMethod);
        const payoutDeposit = await axios.post(
          `${BACKEND_URL}/payment/claimDeposit`,
          { cardId: token.token.card.id }
        );
        console.log(payoutDeposit);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="claimDeposit-cardElement">
        <label>
          Card details
          <CardElement options={options} />
        </label>
        <Button type="submit" disabled={!stripe}>
          Pay
        </Button>
      </form>
    );
  };

  return (
    <div>
      <Elements stripe={stripe}>
        {/* {<CardForm />} */}
        {/* <Button
          onClick={() => {
            addBalance();
          }}
        >
          Add Balance
        </Button> */}
        <Grid>
          <Grid.Col span={6}>
            <Button
              radius="xl"
              disabled={
                props.status === "Deposit Claimed" ||
                props.status === "Deposit Returned"
              }
              onClick={() => {
                claimDeposit();
              }}
            >
              Claim Deposit
            </Button>{" "}
          </Grid.Col>
          <Grid.Col span={6}>
            <Button
              radius={"xl"}
              disabled={
                props.status === "Deposit Claimed" ||
                props.status === "Deposit Returned"
              }
              onClick={() => createStripeAccount()}
            >
              Create Account
            </Button>
          </Grid.Col>
        </Grid>
      </Elements>
    </div>
  );
}
