import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  TextField,
} from "preskok"

export function RenameProject() {
  return (
    <Modal defaultOpen>
      <Button intent="outline">Rename</Button>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Rename project</ModalTitle>
          <ModalDescription>
            Change how this project will appear across the dashboard.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <TextField aria-label="Name">
            <Input placeholder="Enter a name" defaultValue="Checkout redesign" />
          </TextField>
        </ModalBody>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <Button intent="primary">Save changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export function DeleteConfirmation() {
  return (
    <Modal defaultOpen>
      <Button intent="danger">Delete workspace</Button>
      <ModalContent role="alertdialog" size="sm" isBlurred>
        <ModalHeader>
          <ModalTitle>Delete workspace?</ModalTitle>
          <ModalDescription>
            Active members, API keys, and billing exports will be removed.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose intent="outline">Cancel</ModalClose>
          <Button intent="danger">Delete workspace</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
