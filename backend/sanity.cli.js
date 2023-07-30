import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '0dq6tdm1',
    dataset: 'production',
    disableCdn: true,
  },
})
