export default function createPipeline() {
    return [
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
            'position': '$_id', 
            '_id': 0
          }
        }, {
          '$sort': {
            'position': 1
          }
        }
      ]
}