import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { BACKEND_URL } from "../../constants";
import { Button } from "@mantine/core";
import { UserContext } from "../../App";

const CURRENCY = "SGD";
const amountInDollars = (amount) => parseInt(amount * 100);

export default function ReturnDeposit(props) {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [amount, setAmount] = useState(props.amount);
  const [chargeId, setChargeId] = useState();

  const user = useContext(UserContext);

  const paymentSuccess = () => {
    alert("Return Successful!");
  };
  const paymentError = () => {
    alert("Return Error!");
  };

  useEffect(() => {
    getChargeId();
  }, []);

  const getChargeId = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/payment/${props.listing._id}`
    );
    console.log(response.data);
    setChargeId(response.data.chargeId);
  };

  const getRefund = async () => {
    const response = await axios.post(`${BACKEND_URL}/payment/refund`, {
      charge: chargeId,
      amount: amountInDollars(amount),
    });
    console.log(response);
    if (response.status === 200) {
      const payment = await axios.put(
        `${BACKEND_URL}/payment/${props.listing._id}`
      );
      console.log(payment);
      return paymentSuccess();
    } else {
      return paymentError();
    }
  };

  const onToken = (amount, description) => async (token) => {
    const response = await axios.post(`${BACKEND_URL}/payment/refund`, {
      charge: chargeId,
      amount: amountInDollars(amount),
    });
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      const payment = await axios.post(
        `${BACKEND_URL}/payment/${props.listing._id}`,
        {
          payerId: user._id,
          receiverId: props.listing.userId,
          amount: amountInDollars(amount),
        }
      );
      console.log(payment.data);
      return paymentSuccess();
    } else return paymentError();
  };

  const Checkout = ({ name, description, amount }) => {
    return (
      <StripeCheckout
        name={name}
        description={description}
        amount={amountInDollars(amount)}
        token={onToken(amount, description)}
        currency={CURRENCY}
        stripeKey={process.env.STRIPE_PUBLIC_KEY}
        zipCode
        email
        allowRememberMe
      />
    );
  };
  return (
    <div>
      <Button
        variant="dark"
        radius={"md"}
        onClick={() => {
          getRefund();
        }}
      >
        Return Deposit
      </Button>
    </div>
  );
}
