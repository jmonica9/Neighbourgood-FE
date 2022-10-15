import { ScrollArea, Stack, Card, Text } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { neighbourgoodTheme } from "../styles/Theme";
import Review from "./Review";

export default function DashboardReviews() {
  const user = useContext(UserContext);
  const [selectedReview, setSelectedReview] = useState();
  const [openReviewModal, setOpenReviewModal] = useState(false);

  useEffect(() => {
    // console.log(user);
  }, [user]);

  const closeReviewModal = () => {
    setOpenReviewModal(false);
  };

  const userReviews = [
    {
      _id: 1,
      requestorId: "requestorId",
      // ownerId: user._id,
      reviewText: "review string 1",
      type: "sharing",
    },
    {
      _id: 2,
      requestorId: "requestorId",
      // ownerId: user._id,
      reviewText: "review string 2",
      type: "helping",
    },
    {
      _id: 3,
      requestorId: "requestorId",
      // ownerId: user._id,
      reviewText: "review string 3",
      type: "lending",
    },
    {
      _id: 4,
      requestorId: "requestorId",
      // ownerId: user._id,
      reviewText: "review string 4",
      type: "helping",
    },
  ];

  const displayReviews = userReviews.map((review) => {
    let color;
    switch (review.type) {
      case "sharing":
        color = neighbourgoodTheme.colors.lightTeal;
        break;
      case "helping":
        color = neighbourgoodTheme.colors.lightPurple;
        break;
      case "lending":
        color = neighbourgoodTheme.colors.lightBrown;
        break;
      default:
        color = neighbourgoodTheme.colors.lightGray;
    }
    return (
      <div key={review._id}>
        <Card
          sx={{ backgroundColor: color, width: "23vw", cursor: "pointer" }}
          onClick={() => {
            setOpenReviewModal(true);
            setSelectedReview(review);
          }}
        >
          <Text size={"sm"}>"{review.reviewText}"</Text>
        </Card>
      </div>
    );
  });

  return (
    <div>
      {user && userReviews ? (
        <>
          <ScrollArea
            style={{ width: "auto", height: "24vh" }}
            offsetScrollbars
          >
            <Stack>{displayReviews}</Stack>
          </ScrollArea>
          <Review
            review={selectedReview}
            openModal={openReviewModal}
            closeModal={closeReviewModal}
          />
        </>
      ) : null}
    </div>
  );
}
