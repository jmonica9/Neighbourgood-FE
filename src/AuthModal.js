import AuthForm from "./AuthForm";
import { Authentication } from "./Authentication";
import { useState } from "react";
import { Modal, Button, Group, useMantineTheme } from "@mantine/core";

export default function AuthModal() {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  return (
    <>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        onClose={() => setOpened(false)}
        overflow="inside"
      >
        {/* <AuthForm /> */}
        <Authentication onClose={() => setOpened(false)} />
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Register/Login</Button>
      </Group>
    </>
  );
}
