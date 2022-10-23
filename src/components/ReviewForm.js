import { UserContext } from "../App";

import React, { useEffect, useState, useContext } from "react";
import { Button, Paper, TextInput } from "@mantine/core";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import {
//   TextInput,
//   TextInputProps,
//   ActionIcon,
//   useMantineTheme,
// } from "@mantine/core";
// import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons";

// export function InputWithButton(props) {

//   const theme = useMantineTheme();

//   return (
//     <TextInput
//       icon={<IconSearch size={18} stroke={1.5} />}
//       radius="xl"
//       size="md"
//       rightSection={
//         <ActionIcon
//           size={32}
//           radius="xl"
//           color={theme.primaryColor}
//           variant="filled"
//         >
//           {theme.dir === "ltr" ? (
//             <IconArrowRight size={18} stroke={1.5} />
//           ) : (
//             <IconArrowLeft size={18} stroke={1.5} />
//           )}
//         </ActionIcon>
//       }
//       placeholder="Search questions"
//       rightSectionWidth={42}
//       {...props}
//     />
//   );
// }

export default function ReviewForm() {
  const [reviewText, setReviewText] = useState("");
  const { listingId } = useParams();
  const navigate = useNavigate();
  const submitReview = async () => {
    await axios
      .post(`${BACKEND_URL}/review/insertOne/${listingId}`, {
        reviewText: reviewText,
      })
      .then((res) => {
        console.log(res.data, "review submitted");
        toast.success("You have submitted a new review!", {
          position: "top-right",
          autoClose: 4500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        navigate(`/individualReview/${listingId}`);
      });
  };
  return (
    <div>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Review"
          autoComplete="false"
          value={reviewText}
          placeholder="Type review here"
          onChange={(e) => setReviewText(e.target.value)}
          required
        />
        <Button sx={{ marginTop: "1rem" }} type="submit" onClick={submitReview}>
          Submit
        </Button>
      </Paper>
    </div>
  );
}
