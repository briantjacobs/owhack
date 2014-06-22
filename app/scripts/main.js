'use strict';

var PlateCollection = Backbone.Collection.extend({
    url: '/data/species.json',
    // model: Plate,
    parse: function(resp, xhr) {
      var results = resp;
      var nest = d3.nest()
          .key(function(d) { return d.plate_number; })
          .entries(results);
        return nest;
    },
});

// The View for a Person
var PlateView = Backbone.View.extend({
  className: 'plate',
  viewHelpers: {
    zeroPad: function(num, numZeros) {
      var n = Math.abs(num);
      var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
      var zeroString = Math.pow(10,zeros).toString().substr(1);
      if( num < 0 ) {
        zeroString = '-' + zeroString;
      }
      return zeroString+n;
    }
  },
  template: _.template($('#plate-template').html()),

  render: function(){
      var data = this.model.toJSON();
      _.extend(data, this.viewHelpers);
      this.$el.html( this.template({plate:data}));

      //add data attributes here to the div for filtering


      //loop through var data here and add a svg


      return this;  // returning this from render method..
  }
});

// View for all plate
var BookView = Backbone.View.extend({
  el: '#plates',

  initialize: function() {
    this.collection = new PlateCollection();
  },
  //bind to model change. when it changes, fade out the filtered model then re-render the whole view 

  render: function(){
    var self = this;
      this.collection.fetch({
        success: function(plates) {
          plates.each(function(plate){
          var plateView = new PlateView({ model: plate });
          self.$el.append(plateView.render().el); // calling render method manually..
         });
        }
      });
      return this; // returning this for chaining..
  }
});

//render initial view
var bookView = new BookView();
bookView.render();
