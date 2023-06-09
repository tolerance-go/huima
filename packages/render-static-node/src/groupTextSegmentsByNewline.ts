import { StyledTextSegmentType } from '@huima/common/types'

/**
 * 这个函数将传入的数组继续进行分割
 * 如果元素中的 characters 存在 \n 换行符就进行拆分
 * 拆分的时候，之前的所有未合并的元素就合并成一个数组
 */
export function groupTextSegmentsByNewline(
   segments: StyledTextSegmentType,
): StyledTextSegmentType[] {
   let groupedSegments: StyledTextSegmentType[] = []
   let currentGroup: StyledTextSegmentType = []

   segments.forEach((segment) => {
      const splitSegments = segment.characters.split('\n')
      splitSegments.forEach((splitSegment, index) => {
         // Create a new segment with the current split characters
         const newSegment = { ...segment, characters: splitSegment }

         // If the current split segment isn't an empty string, add it to the current group
         if (splitSegment !== '') {
            currentGroup.push(newSegment)
         }

         // If we're at the end of the current segment, or the current split segment is an empty string,
         // add the current group to the grouped segments and start a new group, but only if the current group is not empty
         if (
            index !== splitSegments.length - 1 ||
            (splitSegment === '' && currentGroup.length > 0)
         ) {
            groupedSegments.push(currentGroup)
            currentGroup = []
         }
      })
   })

   // If there are any remaining segments in the current group, add them to the grouped segments
   if (currentGroup.length > 0) {
      groupedSegments.push(currentGroup)
   }

   return groupedSegments
}
