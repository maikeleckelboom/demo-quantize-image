const quantizeMachine = createMachine({
  context: {},
  states: {
    'selecting-source': {
      on: {
        TAKE_PICTURE: 'extracting-colors',
        BROWSE_IMAGE: 'extracting-colors'
      }
    },
    'quantize-colors': {},
    'selecting-colors': {}
  },
  on: {}
})
