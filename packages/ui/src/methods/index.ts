import { showMode } from '../states'

export const handleGenCode = () => {
   console.log('handleGenCode')

   parent.postMessage(
      {
         pluginMessage: {
            type: 'genCode',
         },
      },
      '*',
   )
}

export const handleShowCodeBtnClick = () => {
   showMode.value = 'code'
}

export const handleShowPlaygroundBtnClick = () => {
   showMode.value = 'playground'
}
