const userTransactionQuery = `
                query GetTransactionData($userId: Int!) {
                  transaction(where: { _and: [{ userId: { _eq: $userId } }, { type: { _eq: "xp" } }] }) {                    id
                    type
                    amount
                    userId
                    createdAt
                  }
                }`;

const userProgressQuery = `
                query GetUserProgress($userId: Int!) {
                  progress(where: { userId: { _eq: $userId } }) {
                    id
                    userId
                    objectId
                    grade
                    createdAt
                    updatedAt
                  }
                }`;

const userResultQuery = `
                query GetUserResult($userId: Int!) {
          
                  result(where: { userId: { _eq: $userId } }) {
                    id
                    userId
                    objectId
                    grade
                    createdAt
                    updatedAt
                  }
                }`;

const objectQuery = `
                query GetObjectData($objectId: Int!) {
                  object(where: { id: { _eq: $objectId } }) {
                    id
                    name
                    type
                    attrs
                  }
                }`;


const user = `
        query {
            user {
                id
                login
            }
        }
    `;

