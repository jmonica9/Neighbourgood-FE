import React, { useContext, useState } from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { BACKEND_URL } from "../../constants";
import { Button } from "@mantine/core";
import { UserContext } from "../../App";

const CURRENCY = "SGD";
const amountInDollars = (amount) => parseInt(amount * 100);

export default function DeopsitCheckout(props) {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [amount, setAmount] = useState(props.amount);

  const user = useContext(UserContext);

  const paymentSuccess = () => {
    alert("Payment Successful!");
  };
  const paymentError = () => {
    alert("Payment Error!");
  };

  const onToken = (amount, description) => async (token) => {
    console.log(amount, typeof amount);
    console.log(props);
    const response = await axios.post(`${BACKEND_URL}/payment`, {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: amountInDollars(props.amount),
    });
    // console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      console.log(response);
      const payment = await axios.post(
        `${BACKEND_URL}/payment/${props.listing._id}`,
        {
          payerId: user._id,
          receiverId: props.listing.userId,
          chargeId: response.data.success.id,
          amount: amountInDollars(props.amount),
        }
      );
      console.log(payment.data);
      props.updatePaymentStatus();
      props.refresh();
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
      <StripeCheckout
        name={name}
        description={description}
        amount={amountInDollars(amount)}
        token={onToken(amount, description)}
        currency={CURRENCY}
        stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
        allowRememberMe
        key={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
        panelLabel="Submit Deposit"
      >
        <Button
          variant="dark"
          radius={"md"}
          disabled={props.status === "Deposit Paid"}
        >
          Submit Deposit
        </Button>
      </StripeCheckout>
    </div>
  );
}
