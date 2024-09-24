function escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

export default function createPipeline(name: string, page: number = 0, max: number = Infinity, count: boolean = false, nationality: string | Record<'$ne', true> = {'$ne': true}) {
    return [
        {
          '$match': {
            'nationality': {
              '$ne': null
            }
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
                '$match': {
                  '$expr': {
                    '$ne': [
                      {
                        '$size': '$level'
                      },
                      0
                    ]
                  }
                }
              },{
                '$project': {
                  'level': {
                    '$first': '$level'
                  }
                }
              }, {
                '$project': {
                  'level': {
                    'position': 1
                  }
                }
              }
            ], 
            'as': 'records'
          }
        }, {
          '$group': {
            '_id': '$abbr', 
            'nationality': {
              '$first': '$nationality'
            }, 
            'abbr': {
              '$first': '$abbr'
            }, 
            'points': {
              '$first': '$points'
            }, 
            'records': {
              '$push': '$records'
            }
          }
        }, {
          '$project': {
            'nationality': {
                '$replaceAll': {
                  'input': "$nationality",
                  'find': "_",
                  'replacement': " "
                }
              },
            'abbr': 1, 
            'points': 1, 
            'records': {
              '$reduce': {
                'input': '$records', 
                'initialValue': [], 
                'in': {
                  '$setUnion': [
                    {
                      '$map': {
                        'input': '$$this', 
                        'as': 'array', 
                        'in': '$$array.level.position'
                      }
                    }, '$$value'
                  ]
                }
              }
            }
          }
        }, {
          '$project': {
            'name': 1, 
            'nationality': 1, 
            'abbr': 1, 
            'points': 1, 
            'records': {
              '$map': {
                'input': '$records', 
                'in': {
                  '$cond': {
                    'if': {
                      '$gt': [
                        '$$this', 150
                      ]
                    }, 
                    'then': 0, 
                    'else': {
                      '$round': [
                        {
                          '$divide': [
                            {
                              '$subtract': [
                                74875, {
                                  '$multiply': [
                                    375, '$$this'
                                  ]
                                }
                              ]
                            }, 298
                          ]
                        }, 2
                      ]
                    }
                  }
                }
              }
            }
          }
        }, {
          '$project': {
            'name': '$nationality', 
            'nationality': 1, 
            'abbr': 1, 
            'records': {
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
            'partitionBy': '_id', 
            'sortBy': {
              'records': -1
            }, 
            'output': {
              'position': {
                '$documentNumber': {}
              }
            }
          }
        }, {
            '$match': {
              'name': new RegExp(`${escapeRegExp(name) || "^"}`, 'i'),
              'abbr': nationality
            }
          },
          {
              '$setWindowFields': {
                'partitionBy': '_id', 
                'sortBy': {
                  'records': -1
                }, 
                'output': {
                  'number': {
                    '$documentNumber': {}
                  }
                }
              }
            }, 
            count ? {
              '$count': 'documents'
            } : {
              '$match': {
                'number': {
                    '$gt': max == Infinity ? 0 : (page-1)*max,
                    '$lte': page*max
                }
              }
            }
      ]
}