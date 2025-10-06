Your job is to add a modal manager.

This has to run through the Orchestrator. but organise it into its separate Manager file.

See BreakpointManager or EditorManager as a reference.

I would like to be able to call `orchestrator.showModal('modal-name', {options})` from anywhere within the app.
and also other utils like hideModal.

For this you will need to add a baseModal, using react-modal.
Then add a few examples for modals. small files that are proofs of the concept that I can open on demand.

Available modals probably need to be put in an object like

const availableModals = {
'example-modal': ExampleModalComponent,
'another-modal': AnotherModalComponent,
};

Then the ModalManager can render the correct modal based on the name passed to showModal.
