import { useEffect, useState } from "react";
import { Drawer, Button, Group, Text } from "@mantine/core";

export default function SideDrawer(props) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(props.openDrawer);
  }, [props]);

  return (
    <>
      <Drawer
        sx={{ transform: "translateX(50px)" }}
        opened={opened}
        onClose={() => props.closeDrawer()}
        title="Placeholder"
        padding="xl"
        size="20vw"
        closeOnClickOutside={false}
        withOverlay={false}
        withinPortal={false}
        withCloseButton={false}
      >
        {/* Drawer content */}
        <Text>Welcome Back, user</Text>
      </Drawer>
    </>
  );
}
