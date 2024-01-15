import calc_points from "@/functions/points";

export default function createPipeline(id: string) {
    return [
        {
          '$lookup': {
            'from': 'records', 
            'let': {
              'id': '$_id'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$playerId', '$$id'
                    ]
                  }
                }
              }, {
                '$lookup': {
                  'from': 'levels', 
                  'localField': 'levelId', 
                  'foreignField': '_id', 
                  'as': 'level'
                }
              }, {
                '$project': {
                  '_id': 0, 
                  'id': {
                    '$toString': '$_id'
                  }, 
                  'link': 1, 
                  'verification': 1, 
                  'beaten_when_weekly': 1, 
                  'level': {
                    '$first': '$level'
                  }
                }
              }, {
                '$project': {
                  '_id': 0, 
                  'id': '$_id', 
                  'link': 1, 
                  'verification': 1, 
                  'beaten_when_weekly': 1, 
                  'level': {
                    'name': 1, 
                    'ytcode': 1, 
                    'publisher': 1, 
                    'position': 1, 
                    'id': {
                      '$toString': '$level._id'
                    }
                  }
                }
              }
            ], 
            'as': 'records'
          }
        }, {
          '$project': {
            'name': 1, 
            'records': {
              '$map': {
                'input': '$records', 
                'in': {
                  '$function': {
                    'body': calc_points.toString(),
                    'args': [
                      '$$this.level.position'
                    ], 
                    'lang': 'js'
                  }
                }
              }
            }
          }
        }, {
          '$project': {
            'id': {
                '$toString': '$_id'
            },
            '_id': 0,
            'name': 1, 
            'points': {
              '$round': [
                {
                  '$reduce': {
                    'input': '$records', 
                    'initialValue': 0, 
                    'in': {
                      '$add': [
                        '$$value', '$$this'
                      ]
                    }
                  }
                }, 2
              ]
            }
          }
        }, {
          '$setWindowFields': {
            'sortBy': {
              'points': -1
            }, 
            'output': {
              'position': {
                '$documentNumber': {}
              }
            }
          }
        }, {
          '$match': {
            'id': id
          }
        }
      ]
}