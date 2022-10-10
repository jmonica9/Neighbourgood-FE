import { useEffect, useState } from "react";
import { Drawer, Button, Group, Text, createStyles } from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  drawerPaper: {
    backgroundColor: neighbourgoodTheme.colors.darkGray,
    color: "white",
    borderBottom: 0,
  },
}));

export default function SideDrawer(props) {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const { classes } = useStyles();

  useEffect(() => {
    setOpened(props.openDrawer);
  }, [props]);

  return (
    <>
      <Drawer
        // select classnames from above to target specific sub-components
        classNames={{ drawer: classes.drawerPaper }}
        sx={{
          transform: "translateX(50px)",
        }}
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
        <Text>Welcome Back, user</Text>
        {/* Drawer content */}
        <button
          onClick={() => {
            navigate("/sharing");
          }}
        >
          Sharing
        </button>
        <button
          onClick={() => {
            navigate("/helping");
          }}
        >
          Helping
        </button>
        <button
          onClick={() => {
            navigate("/lending");
          }}
        >
          Lending
        </button>
      </Drawer>
    </>
  );
}
