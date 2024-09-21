const userTransactionQuery = `
                query GetTransactionData($userId: Int!, $eventId: Int!) {
                  transaction(where: { 
                    _and: [
                      { userId: { _eq: $userId } }, 
                      { type: { _eq: "xp" } }, 
                      { eventId: { _eq: $eventId } },
                      { objectId: { _neq: 100569 } }
                    ]
                  }) {                    
                    id
                    type
                    amount
                    objectId
                    userId
                    createdAt
                    path
                  }
                }`;
//100569 is pisice js

const userProgressQuery = `
                query GetUserProgress($userId: Int!) {
                  progress(where: { userId: { _eq: $userId }, object: { type: { _eq: "project" } } }) {
                    id
                    userId
                    objectId
                    grade
                    createdAt
                    updatedAt
                    object {
                      id
                      name
                      type
                      attrs
                    }
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
              query GetObjectsData($objectIds: [Int!]!) {
                object(where: { id: { _in: $objectIds } }) {
                  id
                  name
                  type
                  attrs
                }
              }`;


const userDetailsQuery = `
       query GetUser($userId: Int!, $eventId: Int!) {
            user {
                id
                login
                totalUp
                totalDown
             		auditRatio
            }
            event_user(where: { userId: { _eq: $userId }, eventId:{_eq:$eventId}}){
                level
          			userAuditRatio
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

const userSkillsQuery = `
        query test($userId: Int) {
          user(where: {id: {_eq: $userId}}) {
            transactions(
              order_by: [{type: desc}, {amount: desc}]
              distinct_on: [type]
              where: {userId: {_eq: $userId}, type: {_in: ["skill_js", "skill_go", "skill_html", "skill_prog", "skill_front-end", "skill_back-end"]}}
            ) {
              type
              amount
            }
          }
        }
  `;

const userEventsQuery = `
 query GetUser($userId: Int!) {
            event_user(where: {
                    _and: [
                      { userId: { _eq: $userId } },
                      { level: { _neq: 0 } }
                    ]
                  }){
                    						eventId
            }
        }`;