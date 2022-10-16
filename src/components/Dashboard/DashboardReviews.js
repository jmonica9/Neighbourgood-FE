import { ScrollArea, Stack, Card, Text } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { neighbourgoodTheme } from "../../styles/Theme";
import Review from "./Review";

export default function DashboardReviews() {
  const user = useContext(UserContext);
  const [selectedReview, setSelectedReview] = useState();
  const [openReviewModal, setOpenReviewModal] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const closeReviewModal = () => {
    setOpenReviewModal(false);
  };

  const userReviews = [
    {
      requestorId: "requestorId",
      // ownerId: user._id,
      reviewText: "review string 1",
      type: "sharing",
    },
    {
      requestorId: "requestorId",
      // ownerId: user._id,
      reviewText: "review string 2",
      type: "helping",
    },
    {
      requestorId: "requestorId",
      // ownerId: user._id,
      reviewText: "review string 3",
      type: "lending",
    },
    {
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
      <div>
        <Card
          sx={{
            backgroundColor: color,
            width: "22vw",
            cursor: "pointer",
            borderRadius: 15,
          }}
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
    <div name="card">
      {user && userReviews ? (
        <>
          <ScrollArea style={{ height: "30vh" }} offsetScrollbars>
            <Stack spacing={"1vh"}>{displayReviews}</Stack>
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
