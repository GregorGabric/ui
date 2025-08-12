"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Modal } from "@/registry/preskok/ui/preskok-ui/modal"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function ModalPreskokDemo() {
  return (
    <Modal>
      <Button intent="outline">Rename</Button>
      <Modal.Content isBlurred>
        {({ close }) => (
          <>
            <Modal.Header>
              <Modal.Title>Rename project</Modal.Title>
              <Modal.Description>
                Change how this project will appear across the dashboard.
              </Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <TextField
                autoFocus
                aria-label="Name"
                placeholder="Enter a name"
              />
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>Cancel</Modal.Close>
              <Button onPress={close} intent="primary">
                Save changes
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  )
}
