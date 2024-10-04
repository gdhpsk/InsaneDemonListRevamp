export default function createPipeline() {
    return [
      {
        '$match': {
            'type': "classic"
        }
    },
        {
          '$group': {
            '_id': {
              '$concat': [
                {
                  '$toString': "$position"
                },
                "$type"
              ]
            }, 
            'packId': {
              '$first': '$_id'
            }, 
            'name': {
              '$first': '$name'
            }, 
            'position': {
              '$first': '$position'
            },
            'levels': {
              '$push': {
                '$toString': '$levelId'
              }
            }, 
            'color': {
              '$first': '$color'
            }
          }
        }, {
          '$project': {
            'id': {
              '$toString': '$packId'
            }, 
            'name': 1, 
            'levels': {
              '$size': '$levels'
            }, 
            'color': 1, 
            'position': 1, 
            '_id': 0
          }
        }, {
          '$sort': {
            'position': 1
          }
        }
      ]
}