import { gql } from "@apollo/client";
export const LOADONEUSER = gql`
  query Oneuser($id: String!, $password: String!) {
    Oneuser(id: $id, password: $password) {
      _id
    }
  }
`;
export const GETALLTASKS = gql`
  query taskUser($id: String!) {
    taskUser(id: $id) {
      tasks {
        task
        completed
        creationTime
        completionTime
      }
    }
  }
`;
