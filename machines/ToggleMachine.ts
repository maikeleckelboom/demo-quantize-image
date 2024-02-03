import { setup } from 'xstate'

const toggleMachineSetup = setup({
  types: {
    context: {} as {},
    events: {} as { type: 'toggle' } | { type: '' }
  },
  guards: {
    isValid: ({ context }) => true
  }
})

const ToggleMachine = toggleMachineSetup.createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: { toggle: 'active' }
    },
    active: {
      on: { toggle: 'inactive' }
    }
  }
})

export { ToggleMachine }
