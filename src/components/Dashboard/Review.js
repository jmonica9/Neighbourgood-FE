import { Card, Modal, Text } from "@mantine/core";
import { resolveComponentProps } from "@mui/base";
import React, { useEffect, useState } from "react";
import { neighbourgoodTheme } from "../../styles/Theme";

export default function Review(props) {
  const [opened, setOpened] = useState(props.openModal);
  const [review, setReview] = useState(props.review);
  const [themeColor, setThemeColor] = useState();
  useEffect(() => {
    setOpened(props.openModal);
    setReview(props.review);
  }, [props]);

  useEffect(() => {
    if (props.review) {
      if (props.review.type === "sharing") {
        setThemeColor(neighbourgoodTheme.colors.lightTeal);
      } else if (props.review.type === "helping") {
        setThemeColor(neighbourgoodTheme.colors.lightPurple);
      } else if (props.review.type === "lending") {
        setThemeColor(neighbourgoodTheme.colors.lightBrown);
      }
    }
  });

  return (
    <>
      {review ? (
        <Modal
          centered
          opened={opened}
          onClose={() => {
            setOpened(false);
            props.closeModal();
          }}
          title={`${props.review.type} Listing Review`}
        >
          <Card sx={{ backgroundColor: themeColor, borderRadius: 25 }}>
            <Text size={"sm"}>By : {props.review.requestorId}</Text>
            <Text size={"sm"}>Review : {props.review.reviewText}</Text>
          </Card>
        </Modal>
      ) : null}
    </>
  );
}
