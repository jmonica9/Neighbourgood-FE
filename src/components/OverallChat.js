import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { Button } from "bootstrap";

import airfryer from "../images/is-air-frying-healthy44-79f5ff9.jpg";

const getColor = (type) => {
  switch (type) {
    case "lending":
      return "blue";
      break;
    case "sharing":
      return "cyan";
      break;
    case "giving":
      return "pink";
      break;
    default:
      return "red";
  }
};
const data = [
  {
    avatar: airfryer,
    name: "listing1",
    user: "bob",
    type: "giving",
    status: "open",
  },
  {
    avatar: airfryer,
    name: "listing2",
    user: "joe",
    type: "lending",
    status: "close",
  },
  {
    avatar: airfryer,
    name: "listing3",
    user: "tim",
    type: "sharing",
    status: "open",
  },
  {
    avatar: airfryer,
    name: "listing4",
    user: "lala",
    type: "giving",
    status: "close",
  },
];

export function OverallChats(props) {
  const theme = useMantineTheme();
  const rows = data.map((item) => (
    <div>
      <Group spacing="sm">
        <tr key={item.name}>
          <td>
            <Group spacing="sm">
              <Avatar size={30} src={item.avatar} radius={30} />
              <Text size="sm" weight={500}>
                {item.name}
              </Text>
            </Group>
          </td>

          <td>
            <Badge color={getColor(item.type)} variant="filled">
              {item.type}
            </Badge>
          </td>
          <td>{item.user}</td>
          <td>
            <Text size="sm" color="dimmed">
              {item.status}
            </Text>
          </td>
          <td>
            <button>{">"}</button>
          </td>
        </tr>
      </Group>
    </div>
  ));

  return (
    <Group spacing="sm">
      <Table
        style={{
          marginLeft: props.drawerOpen ? "26vw" : "6vw",
          marginRight: "4vw",
          marginTop: "0.5vw",
          minWidth: "100vw",
        }}
        verticalSpacing="sm"
      >
        <thead>
          <tr>
            <th>Listing</th>
            <th>Type</th>
            <th>Posted By</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Group>
  );
}
