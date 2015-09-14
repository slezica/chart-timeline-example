var colors = [
  'rgb(220, 20, 20)',
  'rgb(20, 20, 220)'
]

$(document).ready(function() {
  var items = generateItems()
  var data   = toChartData(items)
  var selectedItem = null

  var canvas = $('#chart canvas')
  var line = new Chart(canvas[0].getContext('2d')).Line(data, {
    scaleUse2Y: true,
    bezierCurve: false,
    customTooltips: function() {}
  })

  canvas.mousemove(function(e) {
    var points = _.pluck(line.getPointsAtEvent(e), 'value')

    var id = (points.length > 0) ? points[0].id : null

    if (! selectedItem || id !== selectedItem.id) {
      selectedItem = items[id]
      onInspectItem(selectedItem, items)
    }
  })

  canvas.mouseleave(function() {
    onInspectItem(selectedItem = null)
  })
})


function onInspectItem(item, items) {
  $sidebar = $('#sidebar')
  $events = $('#sidebar').find('.events')
  $values = $sidebar.find('.values')

  var duration = 300 // fade in + fade out

  $sidebar.fadeOut(duration / 2, function after() {
    $events.empty()

    if (item) {
      _.each(item.events, function(event) {
        $events.append('<li class="event"><span class="plus">+</span><img src="pic.png" class="avatar"><span class="name">' + event + '</span></li>')
      })

      _.times(2, function(i) {
        $line = $values.find('.line-' + (i + 1))

        var value = item.values[i].toString()
        $line.find('.value').text(value)

        if (items[item.id - 1]) {
          var delta = item.values[i] - items[item.id - 1].values[i]
          $line.find('.delta').text('(' + delta + ')')
        }

        $line.find('.color').css({ backgroundColor: colors[i] })
      })
    }

    $sidebar.fadeIn(duration / 2)
  })
}


function randInt(max) {
  return Math.round(max * Math.random())
}


function ChartPoint(id, value) {
  this.id    = id
  this.value = value
}

ChartPoint.prototype.toString = function() {
  return this.value.toString()
}


function randomItem(id) {
  return {
    id    : id,
    values: _.times(2, function(i) { return randInt(50) * (i + 1) }),
    events: _.times(randInt(2) + 1, function(i) { return 'Person ' + id + ': ' + (i + 1) })
  }
}

function generateItems() {
  return _.times(10, function(i) { return randomItem(i) })
}

function toChartData(items) {
  var labels = _.times(items.length, function(i) { return 'Period ' + i })

  return {
    labels: labels,
    datasets: [
      {
        label: "Dataset 1" ,
        fillColor: "transparent",
        strokeColor: colors[0],
        pointColor: colors[0],
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "#000",
        data: _.map(items, function(item) {
          return new ChartPoint(item.id, item.values[0])
        })
      }, {
        label: "Dataset 2",
        fillColor: "transparent",
        strokeColor: colors[1],
        pointColor: colors[1],
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "#000",
        data: _.map(items, function(item) {
          return new ChartPoint(item.id, item.values[1])
        })
      }
    ]
  }
}
