export default function createPipeline(levels: string[]) {
    return [
        {
          '$match': {
            '$expr': {
              '$in': [
                '$levelId', levels.map(e => {
                    return {
                        '$toObjectId': e
                      }
                })
              ]
            }
          }
        }, {
          '$group': {
            '_id': '$playerId', 
            'levelIds': {
              '$push': '$levelId'
            }
          }
        }, {
          '$match': {
            '$expr': {
              '$eq': [
                {
                  '$size': '$levelIds'
                }, levels.length
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'players', 
            'localField': '_id', 
            'foreignField': '_id', 
            'as': 'player'
          }
        }, {
          '$project': {
            'player': {
              '$first': '$player'
            }
          }
        }, {
          '$project': {
            'id': '$_id'
          }
        }
      ]
}