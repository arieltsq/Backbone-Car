var app = {}

app.NewCar = Backbone.Model.extend({
  defaults: {
    SN: 0,
    brand: '',
    model: '',
    year: ''
  }
})
// ---- Collections
app.NewCarList = Backbone.Collection.extend({
  model: app.NewCar,
  localStorage: new Store('backbone-Wipro')
})

// instance of the new collection
app.carList = new app.NewCarList()

// --- Views

app.NewCarView = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('#item-template').html()),
  render: function () {
    this.$el.html(this.template(this.model.toJSON()))
    this.inputBrand = this.$('#editBrand')
    this.inputModel = this.$('#editModel')
    this.inputYear = this.$('#editYear')

    return this
  },
  initialize: function () {
    this.model.on('change', this.render, this)
    this.model.on('destroy', this.remove, this)
  },
  events: {
    'dblclick label': 'edit',
    'blur .edit': 'close',
    'click .destroy': 'destroy',
    'click .editing': 'edit'
  },
  edit: function () {
    this.$el.addClass('editing')
  },
  destroy: function () {
    this.model.destroy()
  },
  close: function () {
    var editBrand = this.inputBrand.val().trim()
    var editModel = this.inputModel.val().trim()
    var editYear = this.inputYear.val().trim()

    if (editBrand) {
      this.model.save({brand: editBrand})
    }
    if (editModel) {
      this.model.save({model: editModel})
    }
    if (editYear) {
      this.model.save({year: editYear})
    }
    this.$el.removeClass('editing')
  },
  destroy: function () {
    this.model.destroy()
  }
})
var count = 0
// renders the full list of todo items call NewCarView for each one.
app.AppView = Backbone.View.extend({
  el: '#cars',
  initialize: function () {
    this.inputBrand = this.$('#new-brand')
    this.inputModel = this.$('#new-model')
    this.inputYear = this.$('#new-year')
    // when new elements are added to the Collection render then with addOne
    app.carList.on('add', this.addOne, this)
    app.carList.on('reset', this.addAll, this)
    app.carList.fetch() // loads list from localStorage

  },
  events: {
    'click .creating': 'create'
  },
  create: function (e) {
    app.carList.create(this.newAttributes())
    this.inputBrand.val('')
    this.inputModel.val('')
    this.inputYear.val('')
  },
  addOne: function (NewCar) {
    var view = new app.NewCarView({model: NewCar})
    $('#car-list').append(view.render().el)
  },
  addAll: function () {
    this.$('#car-list').html('') // clean the todo list
    app.carList.each(this.addOne, this)
  },
  newAttributes: function () {
    return {
      SN: count += 1,
      brand: this.inputBrand.val().trim(),
      model: this.inputModel.val().trim(),
      year: this.inputYear.val().trim()
    }
  }
})
// -- initializers
app.appView = new app.AppView()
