import { gql } from "@apollo/client";

export const ADDUSER = gql`
  mutation add($_id: String!, $password: String!) {
    addUser(_id: $_id, password: $password) {
      _id
    }
  }
`;
export const UPDATEUSER = gql`
  mutation updateUser($_id: String!, $tasks: [TaskInput!]) {
    updateUser(_id: $_id, tasks: $tasks) {
      _id
    }
  }
`;
export const UPDATE_TASK_COMPLETION = gql`
  mutation updateTaskCompletion(
    $_id: String!
    $taskIndex: Int!
    $completionTime: String!
  ) {
    updateTaskCompletion(
      _id: $_id
      taskIndex: $taskIndex
      completionTime: $completionTime
    ) {
      _id
    }
  }
`;
export const REMOVE_TASK = gql`
  mutation removeTask($_id: String!, $taskIndex: Int!) {
    removeTask(_id: $_id, taskIndex: $taskIndex) {
      _id
    }
  }
`;
