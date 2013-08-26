var App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    var ret = [];

    for (var i = 0, l = 1000; i < l; i++) {
      ret.push({firstName: "firstName " + i, lastName: "lastName " + i});
    }

    return ret;
  }
});

App.deferReadiness();

$(function() {
  console.time("boot");
  console.profile();

  Em.run(App, App.advanceReadiness);

  console.profileEnd();
  console.timeEnd("boot");

  scheduleRerun();
});

// FIXME: This is ghetto
var totalRuns = 10, currentRun = 0;

function scheduleRerun() {
  currentRun++;

  setTimeout(function() {
    console.time("reset");
    Em.run(App, App.reset);
    console.timeEnd("reset");

    if (currentRun < totalRuns) { scheduleRerun(); }
  }, 1000);
}