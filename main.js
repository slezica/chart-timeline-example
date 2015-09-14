$(document).ready(function() {
  var items = generateItems()
  var data   = toChartData(items)

  var selectedItem = null

  var canvas = $('#chart canvas')
  var line = new Chart(canvas[0].getContext('2d')).Line(data, {
    scaleUse2Y: true,
    bezierCurve: false,

    customTooltips: function(tooltip) {
      if (! tooltip || ! selectedItem) return
      tooltip.canvas = canvas
      showTooltip(tooltip, selectedItem)
    }
  })

  canvas.mousemove(function(e) {
    var points = _.pluck(line.getPointsAtEvent(e), 'value')

    var id = (points.length > 0) ? points[0].id : null

    if (! selectedItem || id !== selectedItem.id) {
      selectedItem = items[id]
      onInspectItem(selectedItem)
    }
  })

  canvas.mouseleave(function() {
    onInspectItem(selectedItem = null)
  })
})


function onInspectItem(item) {
  $ul = $('#events ul')
  var duration = 300 // fade in + fade out

  $ul.fadeOut(duration / 2, function after() {
    $ul.empty()

    if (item) {
      _.each(item.events, function(event) {
        $('#events ul').append('<li>' + event + '</li>')
      })
    }

    $ul.fadeIn(duration / 2)
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
    events: _.times(randInt(3) + 1, function(i) { return 'Event ' + id + ': ' + (i + 1) })
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
        strokeColor: "rgba(220,20,20,1)",
        pointColor: "rgba(220,20,20,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: _.map(items, function(item) {
          return new ChartPoint(item.id, item.values[0])
        })
      }, {
        label: "Dataset 2",
        fillColor: "transparent",
        strokeColor: "rgba(20,20,110,1)",
        pointColor: "rgba(20,20,110,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: _.map(items, function(item) {
          return new ChartPoint(item.id, item.values[1])
        })
      }
    ]
  }
}

//
// console.log(
//   $canvas.offset().left,
//   $canvas.offset().top,
//   tooltip.x + 'px',
//   tooltip.y + 'px'
// )

function showTooltip(tooltip, item) {
  $tooltip = $('#chart .tooltip')

  $tooltip.hide()
  if (! tooltip) return

  $tooltip.css({
    left: tooltip.canvas.offset().left + tooltip.x + 'px',
    top: tooltip.canvas.offset().top + tooltip.y + 'px',
  })

  _.times(2, function(i) {
    $line = $tooltip.find('.line-' + (i + 1))

    $line.find('.color').css({ backgroundColor: tooltip.legendColors[i].fill })
    $line.find('.value').text(item.values[i])
    console.log($line.find('.value')[0]);
  })

  $tooltip.find('.events').text(item.events.length + ' events')

  $tooltip.show()
}
