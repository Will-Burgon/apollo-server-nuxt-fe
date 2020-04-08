import gql from "graphql-tag";

export const COLLECTION_QUERY = gql`
  query {
    getCollection {
      _id
      title
    }
  }
`;

export const CUSTOMER_QUERY = gql`
  query($id: ID!) {
    getCustomer(_id: $id) {
      jobName
      logo
      contact
      email
      phoneNo
      dateCreated
    }
  }
`;

export const GET_CURRENT_ADMIN = gql`
  query {
    getCurrentAdmin {
      name
      email
      password
      dateCreated
      avatar
    }
  }
`;
export const SIGN_IN_ADMIN = gql`
  mutation($name: String!, $password: String!) {
    signInAdmin(name: $name, password: $password) {
      token
    }
  }
`;
export const SIGN_UP_ADMIN = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    createAdmin(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation(
    $jobName: String!
    $contact: String!
    $email: String!
    $phoneNo: String!
    $logo: String
  ) {
    createCustomer(
      jobName: $jobName
      contact: $contact
      email: $email
      phoneNo: $phoneNo
      logo: $logo
    ) {
      _id
      jobName
      contact
      email
      phoneNo
      logo
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query {
    getCustomers {
      _id
      jobName
      contact
      email
      phoneNo
      dateCreated
      logo
    }
  }
`;
export const CREATE_COLLECTION = gql`
  mutation($title: String!, $images: [String]!, $customerID: ID!) {
    createCollection(title: $title, images: $images, customerID: $customerID) {
      _id
      title
      dateCreated
      images
      customer {
        _id
      }
    }
  }
`;
export const GET_INDIVIDUALS = gql`
  query($customer: ID!) {
    getIndividuals(customer: $customer) {
      _id
      uniqueID
      images
      customer {
        _id
      }
    }
  }
`;
export const CREATE_INDIVIDUAL = gql`
  mutation($uniqueID: String!, $images: [String]!, $customer: ID!) {
    createIndividual(
      uniqueID: $uniqueID
      images: $images
      customer: $customer
    ) {
      uniqueID
      _id
      dateCreated
      images
      customer {
        _id
      }
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation($ID: ID!) {
    deleteCustomer(_id: $ID) {
      _id
    }
  }
`;

export const GET_INDIVIDUAL = gql`
  query($uniqueID: String!) {
    getIndividual(uniqueID: $uniqueID) {
      images
      uniqueID
      _id
      images
    }
  }
`;

export const DELETE_INDIVIDUAL = gql`
  mutation($ID: ID!) {
    deleteIndividual(_id: $ID) {
      _id
      uniqueID
    }
  }
`;

export const CREATE_EMAIL = gql`
  mutation($email: String!, $uniqueID: String!) {
    createEmail(email: $email, uniqueID: $uniqueID) {
      email
      uniqueID
    }
  }
`;
