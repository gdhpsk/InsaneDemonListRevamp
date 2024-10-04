export default function createPipeline() {
    return [
        {
            '$match': {
                'type': "platformer"
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
            'position': {
              '$first': '$position'
            },
            'packId': {
              '$first': '$_id'
            }, 
            'name': {
              '$first': '$name'
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