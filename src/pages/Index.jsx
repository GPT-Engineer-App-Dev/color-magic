import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [colorHex, setColorHex] = useState("");
  const [colorName, setColorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [colorPreview, setColorPreview] = useState(null);
  const toast = useToast();

  const handleColorChange = (event) => {
    setColorHex(event.target.value);
  };

  const fetchColorName = async () => {
    if (!colorHex.match(/^#([0-9A-F]{3}){1,2}$/i)) {
      toast({
        title: "Invalid Hex Code",
        description: "Please enter a valid hex color code.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.color.pizza/v1/${colorHex.slice(1)}`);
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
        setColorPreview(data.colors[0].hex);
      } else {
        toast({
          title: "Color Not Found",
          description: "No color name found for the given hex code.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the color name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent py="10">
      <FormControl id="hex-color" mb="4">
        <FormLabel>Enter Hex Color Code</FormLabel>
        <Input placeholder="#123ABC" value={colorHex} onChange={handleColorChange} maxLength={7} />
      </FormControl>
      <Button leftIcon={<FaSearch />} colorScheme="teal" onClick={fetchColorName} isLoading={loading}>
        Translate Color
      </Button>
      {colorPreview && (
        <Box mt="6" textAlign="center">
          <Text fontSize="xl" mb="2">
            Color Name: {colorName}
          </Text>
          <Box w="100px" h="100px" bg={colorPreview} borderRadius="md" display="inline-block" boxShadow="md" />
        </Box>
      )}
    </Container>
  );
};

export default Index;
