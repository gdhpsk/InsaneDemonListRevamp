export default function createPipeline(id: string) {
    return[
        {
            '$match': {
                'name': id,
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
              '$push': '$levelId'
            }, 
            'color': {
              '$first': '$color'
            }
          }
        }, {
          '$lookup': {
            'from': 'platformers', 
            'let': {
              'levs': '$levels'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$in': [
                      '$_id', '$$levs'
                    ]
                  }
                }
              }, {
                '$project': {
                  'position': 1,
                  'name': 1, 
                  'ytcode': 1, 
                  'publisher': 1, 
                  'id': {
                    '$toString': '$_id'
                  }, 
                  '_id': 0
                }
              }
            ], 
            'as': 'levels'
          }
        }, {
          '$project': {
            'id': {
              '$toString': '$packId'
            }, 
            'name': 1, 
            'levels': {
              '$sortArray': {
                'input': '$levels',
              'sortBy': {'position': 1}
              }
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