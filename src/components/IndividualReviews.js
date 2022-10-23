import { Box } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { BACKEND_URL } from "../constants";
import ReviewDetails from "./ReviewDetails";
import ReviewForm from "./ReviewForm";
import { UserContext } from "../App";
function IndividualReview() {
  const { listingId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [combined, setCombined] = useState([]);
  const userData = useContext(UserContext);
  const getReviews = async () => {
    await axios
      .get(`${BACKEND_URL}/review/getOneListing/${listingId}`)
      .then((res) => {
        console.log(res.data, "get review data");
        setReviews(res.data);
      });

    getUserInfo(reviews);
  };

  let combinedDetails = [];
  const getUserInfo = async (reviews) => {
    reviews.forEach(async (review) => {
      const user = await axios.get(`${BACKEND_URL}/users/${review.postedBy}`);
      const listing = await axios.get(
        `${BACKEND_URL}/listing/one/${review.listingId}`
      );
      // console.log(user, listing, "USER LISTING FOR REVIEWS BE");
      combinedDetails.push(
        Object.assign(
          review,
          { user: user.data },
          { listingTitle: listing.data.title }
        )
        // { review, user, listing }
      );
    });
    console.log(combinedDetails);
    setCombined(combinedDetails);
  };

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
    if (userData) {
      reviews.forEach((review) => {
        if (review.postedBy === userData._id) {
          setShowReview(false);
        } else setShowReview(true);
      });
    }
  }, [reviews]);

  useEffect(() => {
    console.log(combined);
  }, [combined]);

  return (
    <Box>
      {!showReview ? <ReviewForm /> : "Ur review Exist"}
      {combinedDetails.length > 0 &&
        combinedDetails.map((review) => {
          return <ReviewDetails review={review} />;
        })}
    </Box>
  );
}

export default IndividualReview;
