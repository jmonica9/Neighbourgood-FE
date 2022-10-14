import { Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { HouseHeartFill } from "react-bootstrap-icons";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Group position="center">
        <Button
          variant="subtle"
          size="xl"
          className="home-button"
          onClick={() => navigate("/")}
        >
          <HouseHeartFill /> &nbsp; Neighbourgood
        </Button>
      </Group>
    </>
  );
}
