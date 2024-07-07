const userDataQuery =`
                query GetUserData($userId: Int!) {
                  user(where: { id: { _eq: $userId } }) {
                    id
                    login
                  }
                  transaction(where: { userId: { _eq: $userId } }) {
                    id
                    type
                    amount
                    userId
                    createdAt
                  }
                  progress(where: { userId: { _eq: $userId } }) {
                    id
                    grade
                    createdAt
                  }
                }`;

const userId = `
        query {
            user {
                id
            }
        }
    `;

