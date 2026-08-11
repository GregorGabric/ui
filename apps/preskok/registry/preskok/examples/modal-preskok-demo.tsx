"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/registry/preskok/ui/preskok-ui/modal"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export function ModalPreskokDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Modal>
        <Button intent="outline">Rename</Button>
        <ModalContent size="md">
          {({ close }) => (
            <>
              <ModalHeader>
                <ModalTitle>Rename project</ModalTitle>
                <ModalDescription>
                  Change how this project will appear across the dashboard.
                </ModalDescription>
              </ModalHeader>
              <ModalBody>
                <TextField aria-label="Name">
                  <Input placeholder="Enter a name" />
                </TextField>
              </ModalBody>
              <ModalFooter>
                <ModalClose>Cancel</ModalClose>
                <Button onPress={close} intent="primary">
                  Save changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal>
        <Button intent="danger">Delete workspace</Button>
        <ModalContent role="alertdialog" size="sm" isBlurred>
          {({ close }) => (
            <>
              <ModalHeader>
                <ModalTitle>Delete workspace?</ModalTitle>
                <ModalDescription>
                  Active members, API keys, and billing exports will be removed.
                </ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <ModalClose intent="outline">Cancel</ModalClose>
                <Button intent="danger" onPress={close}>
                  Delete workspace
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal>
        <Button intent="plain">Preview report</Button>
        <ModalContent size="2xl">
          <ModalHeader
            title="Quarterly report"
            description="Review metrics before sharing them with leadership."
          />
          <ModalBody>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Pipeline", "Revenue", "Retention"].map((metric) => (
                <div key={metric} className="rounded-lg border p-3">
                  <div className="text-sm font-medium">{metric}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Ready for review
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose>Close</ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
