export default function createPipeline() {
    return [
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
            '$push': '$levelId'
          }, 
          'type': {
            '$first': "$type"
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
                'name': 1, 
                'position': 1,
                'ytcode': 1,
                'publisher': 1, 
                'id': {
                  '$toString': '$_id'
                }, 
                '_id': 0
              }
            }
          ], 
          'as': 'platformers'
        }
      }, {
        '$lookup': {
          'from': 'levels', 
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
                'name': 1, 
                'position': 1,
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
          'type': 1,
          'levels': {
            '$sortArray': {
              'input': {
                '$concatArrays': [
                  '$levels',
                  '$platformers'
                ]
              },
              'sortBy': { 'position': 1 }
            }
          }, 
          'color': 1, 
          'position': 1, 
          '_id': 0
        }
      }
    ]
}