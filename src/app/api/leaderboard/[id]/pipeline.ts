export default function createPipeline(id: string) {
    return[
        {
          '$match': {
            '_id': {'$oid': id}
          }
        }, {
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
                    'extreme': {'$regexMatch': {'input': "$level.removalReason", 'regex': 'extreme', 'options': 'i'}},
                    'position': 1,
                    'ytcode': 1, 
                    'publisher': 1, 
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
          '$lookup': {
            'from': 'packs', 
            'let': {
              'levels': {
                '$map': {
                  'input': '$records', 
                  'in': {
                    '$toObjectId': '$$this.level.id'
                  }
                }
              }
            }, 
            'pipeline': [
              {
                '$group': {
                  '_id': '$position', 
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
                '$match': {
                  '$expr': {
                    '$eq': [
                      {
                        '$size': {
                          '$setIntersection': [
                            '$levels', '$$levels'
                          ]
                        }
                      }, {
                        '$size': '$levels'
                      }
                    ]
                  }
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
                  'levels': {
                    '$sortArray': {
                      'input': '$levels',
                      'sortBy': { 'position': 1 }
                    }
                  }, 
                  'color': 1, 
                  'position': '$_id', 
                  '_id': 0
                }
              }
            ], 
            'as': 'packs'
          }
        }, {
          '$project': {
            'id': {
              '$toString': '$_id'
            }, 
            'name': 1, 
            'records': {
              '$sortArray': {
                'input': '$records',
                'sortBy': { 'level.position': 1}
              }
            }, 
            'nationality': 1, 
            'abbr': 1, 
            'packs': {
              '$sortArray': {
                'input': '$packs',
                'sortBy': { 'position': 1 }
              }
            }, 
            '_id': 0
          }
        }
      ]
}