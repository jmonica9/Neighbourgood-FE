import { Modal, Text } from "@mantine/core";
import { resolveComponentProps } from "@mui/base";
import React, { useEffect, useState } from "react";

export default function Review(props) {
  const [opened, setOpened] = useState(props.openModal);
  const [review, setReview] = useState(props.review);
  useEffect(() => {
    setOpened(props.openModal);
    setReview(props.review);
  }, [props]);

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
          <Text size={"sm"}>By : {props.review.requestorId}</Text>
          <Text size={"sm"}>Review : {props.review.reviewText}</Text>
        </Modal>
      ) : null}
    </>
  );
}
