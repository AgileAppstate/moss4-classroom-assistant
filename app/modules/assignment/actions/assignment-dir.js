import { ASSIGNMENT_DIR } from "../constants"

export const assignmentDir = (dir) => {
  return {
    type: ASSIGNMENT_DIR,
    payload: dir
  }
}
