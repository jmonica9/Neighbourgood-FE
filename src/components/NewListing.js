import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Group,
  TextInput,
  MultiSelect,
  Textarea,
  FileInput,
} from "@mantine/core";

export default function NewListing(props) {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState("");
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [listingCategories, setListingCategories] = useState([]);
  useEffect(() => {
    setOpened(props.openModal);
  }, [props]);

  // categories
  const data = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];
  const closeModal = () => {
    setTitle("");
    setFileInputFile();
    setFileInputValue();
    setListingCategories([]);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          props.closeModal();
          closeModal();
        }}
        title={`Add New ${props.type} Listing!`}
      >
        {/* Modal content */}
        <form>
          <TextInput placeholder="Title" label="Title" required />
          <FileInput
            label="Listing Image"
            placeholder={fileInputFile}
            onChange={(e) => setFileInputValue(e.name)}
          />
          <MultiSelect
            data={data}
            label="Listing Category"
            required
            onChange={(e) => {
              setListingCategories(e);
            }}
          />
          <Textarea label={`Description of ${props.type} Listing`} required />
          <Button radius={"xl"} mt={"xs"}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
