(function() {

  return {
    events: {
      'app.created':              'init',
      'click button.enter-goal':  'saveGoal',
      'click button.change-goal': 'showEnterGoal',
      'solvedTicketsReqest.done': 'showBar',
      'solvedTicketsReqest.fail': 'showError'
    },

    requests: {
      solvedTicketsReqest: function(assignee, startDate, endDate) {
        return {
          url: '/api/v2/search.json',
          data: 'query=solved>' + startDate +
                '+solved<' + endDate +
                '+assignee:' + assignee +
                '+type:ticket',
          type: 'GET',
          dataType: 'json'
        };
      }
    },

    getSolvedTickets: function(assignee, startDate, endDate) {
      this.ajax('solvedTicketsReqest', assignee, startDate, endDate);
    },

    showEnterGoal: function() {
      this.switchTo('enter_goal');
    },

    saveGoal: function() {
      var goal = this.$('input.enter-goal').val();
      if ( goal < 1 || goal % 1 !== 0 )  {
        services.notify("Huh? Please enter a positive integer.", 'alert');
        this.showEnterGoal();
      } else {
        this.store( 'goal', this.$('input.enter-goal').val() );
        this.init();
      }
      return false;
    },

    init: function() {
      if ( !this.store('goal') ){
        this.showEnterGoal();
      } else {
        this.switchTo('loading');

        var today = new Date();
        this.getSolvedTickets(
          this.currentUser().email(),
          this.getStartDateQuery(today),
          this.getEndDateQuery(today)
        );
      }
    },

    showBar: function(solvedTickets) {
      var weeklyGoal = this.store('goal');
      var template = (solvedTickets.count >= weeklyGoal) ? 'congrats' : 'prog_bar';

      this.switchTo(template, {
        solvedTickets: solvedTickets,
        ticketsPlural: solvedTickets.count != 1,
        weeklyGoal: weeklyGoal,
        percentSolved: (solvedTickets.count / weeklyGoal) * 100,
        congratsImg: this.getRandomCongratsImg()
      });
    },

    showError: function() {
      this.switchTo('error');
    },

    getRandomCongratsImg: function() {
      return _.sample([
        this.assetURL("congrats_leo.gif"),
        this.assetURL("congrats_pandemonium.gif"),
        this.assetURL("congrats_reggie.gif"),
        this.assetURL("congrats_shia.gif"),
        this.assetURL("congrats_slow_clap.gif"),
        this.assetURL("congrats_taxi_driver.gif"),
        this.assetURL("congrats_yeah.gif"),
        this.assetURL("congrats_zoolander.gif")
      ]);
    },

    // Date helpers

    getLastSunday: function(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -7 : 0);
      return new Date( d.setDate(diff) );
    },

    getUpcomingMonday: function(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? 1 : 8);
      return new Date( d.setDate(diff) );
    },

    getDateQuery: function(d) {
      return ( d.getFullYear() + "-" + ( d.getMonth() + 1 ) + "-" + d.getDate() );
    },

    getStartDateQuery: function(d) {
      return this.getDateQuery( this.getLastSunday(d) );
    },

    getEndDateQuery: function(d) {
      return this.getDateQuery( this.getUpcomingMonday(d) );
    }
  };
}());
