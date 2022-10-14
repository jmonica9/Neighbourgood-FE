import { Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { HouseHeartFill } from "react-bootstrap-icons";
import { UserContext } from "../App";
import { useContext } from "react";

export default function Home() {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  return (
    <>
      <Group position="center">
        <Button
          variant="subtle"
          size="xl"
          className="home-button"
          onClick={() => (user ? navigate("/dashboard") : navigate("/"))}
        >
          <HouseHeartFill /> &nbsp; Neighbourgood
        </Button>
      </Group>
    </>
  );
}
