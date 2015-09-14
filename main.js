$(document).ready(function() {
  var data = generateData()

  var labels = _.pluck(data, 'label')
  var values = _.pluck(data, 'value')
  var events = _.pluck(data, 'event')

  var chartData = {
    labels: labels,
    datasets: [
      {
          label: "Interesting data",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: values
      }
    ]
  }

  var canvas = $('#chart canvas')
  var line = new Chart(canvas[0].getContext('2d')).Line(chartData)

  canvas.mousemove(function(e) {
    var ids = _.pluck(line.getPointsAtEvent(e), 'value.id')
    highlightEvents(ids)
  })

  canvas.mouseleave(function() {
    highlightEvents([])
  })
})


highlightEvents = function highlightEvents(ids) {
  var $ul = $('#events')

  $ul.find('li').each(function(i, li) {
    var $li = $(li)
    var id = $li.data('id')

    if (_.contains(ids, id)) {
      if (id == ids[0]) {

        $ul.scrollTop($li.height() * id)
        // var scrollTop = $li.offset().top - $ul.offset().top + $ul.scrollTop()
        // $ul.animate({ scrollTop: scrollTop }, 500)
      }

      $(li).addClass('highlighted')

    } else {
      $(li).removeClass('highlighted')
    }

  })
}


function ChartValue(id, value) {
  this.id = id
  this.value = value
}

ChartValue.prototype.toString = function() {
  return this.value.toString()
}


function generateData() {
  return _.times(10, function(i) {
    $('#events').append('<li data-id=' + i + '>Event ' + i + '</li>')

    return {
      value: new ChartValue(i, Math.round(i * 100 * Math.random())),
      event: 'Event ' + i,
      label: 'Period ' + i
    }
  })
}
