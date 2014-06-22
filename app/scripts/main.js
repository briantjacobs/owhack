'use strict';

var app = {};

_.extend(app, Backbone.Events);

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
    bySize: function(size) {
        var filtered = this.filter(function(species) {
            return species.get("scale") === size;
        });
        return new PlateCollection(filtered);
    }
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

  initialize: function() {
    var self = this;
    app.bind("filter:size", function(e){
      self.filterView(e);
    });

  },

  filterView: function(scale) {
    var self = this;
    _.each(this.model.get("values"), function(species) {
      if (species.scale == scale) {    
          
      } else {
        this.$el.addClass("inactive")
      }
    });
  },

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
    self = this;
    this.collection = new PlateCollection();

    app.bind("filter:size", function(e){
      self.filterCollection(e);
    });

  },
  //bind to model change. when it changes, fade out the filtered model then re-render the whole view 
  filterCollection: function(size) {
    var self = this;
    // var filtered = this.collection.bySize(size);
    // this.collection = filtered;
    // console.log(filtered)
    // this.render()


    //get the views that have items that should be filtered
    // var filtered = this.collection.each(function(plate) {
    //   _.each(plate.get("values"), function(species) {
    //     if (species.scale == size) {
          
    //       console.log(plate, species)
    //     }
    //   })
    // })
  },

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

var FilterView = Backbone.View.extend({
  el: '#filter',
  events: {
    'click .size-toggle' : 'filterPlates'
  },
  initialize: function() {
  },
  filterPlates: function(e) {
    app.trigger("filter:size", $(e.target).attr("data-id"))
  }

});

//render initial view
var bookView = new BookView();
bookView.render();

var filterView = new FilterView();
filterView.render();
