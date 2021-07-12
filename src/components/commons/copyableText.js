import React, {useState} from "react";
import { Text, IconButton, HStack, Tooltip } from "@chakra-ui/react"
import {CopyIcon} from '@chakra-ui/icons'

function CopyableText(props) {
  const [copied, setCopied] = useState(false)

  function copyToClipboard() {
    var copyText = document.querySelector("#copyable");
    var range = document.createRange();
    range.selectNode(copyText);
    window.getSelection().addRange(range);
    // console.log('Copied ',copyText,' to the clipboard')
    document.execCommand("copy");
    setCopied(true);
  }

  return (
    <HStack>
      <Text id='copyable'>{props.text}</Text>{''}
      <Tooltip
        closeDelay={500}
        isOpen={copied}
        label="Copied!"
      >
      <IconButton
        colorScheme="white"
        aria-label="Copy it!"
        icon={<CopyIcon />}
        onClick={()=>copyToClipboard()}
        />
      </Tooltip>
    </HStack>


  );
}
export default CopyableText;
