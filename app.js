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
      // Validation for start day setting. Defaults to 1 (Monday).
      this.startDay = this.setting('start_day');
      if (this.startDay < 0 || this.startDay > 6) { this.startDay = 1; }

      var weeklyGoal = this.getTicketGoal();
      if (!weeklyGoal){
        this.showEnterGoal();
      } else {
        this.switchTo('loading');
        this.getSolvedTickets(
          this.currentUser().email(),
          this.getStartDateQuery(),
          this.getEndDateQuery()
        );
      }
    },

    getTicketGoal: function() {
      return this.setting('default_ticket_goal') || this.store('goal');
    },

    showBar: function(solvedTickets) {
      var weeklyGoal = this.getTicketGoal();
      var template = (solvedTickets.count >= weeklyGoal) ? 'congrats' : 'prog_bar';

      this.switchTo(template, {
        solvedTickets: solvedTickets,
        ticketsPlural: solvedTickets.count != 1,
        weeklyGoal: weeklyGoal,
        percentSolved: (solvedTickets.count / weeklyGoal) * 100,
        congratsImg: this.getRandomCongratsImg(),
        allowUserDefinedGoals: !this.setting('default_ticket_goal')
      });
    },

    showError: function() {
      this.switchTo('error');
    },

    getRandomCongratsImg: function() {
      return _.sample([
        "https://media.giphy.com/media/OdVug9ZRk8sqA/giphy.gif",
        "http://www.reactiongifs.com/r/d8DEOtY.gif",
        "http://www.reactiongifs.com/wp-content/uploads/2013/06/kid-deal.gif",
        "http://www.reactiongifs.com/r/shia.gif",
        "https://media.giphy.com/media/GQnsaAWZ8ty00/giphy.gif",
        "https://media.giphy.com/media/TItexWpxELSBa/giphy.gif",
        "https://media.giphy.com/media/DKnMqdm9i980E/giphy.gif",
        "http://www.reactiongifs.com/wp-content/uploads/2013/04/lebowski1.gif"
      ]);
    },

    // Date helpers

    getStartDate: function() {
      var today = new Date();
      // Get days since start day by counting backwards in the week
      // E.g., for a Wednesday start day and Today is Friday
      // (Wednesday is 3 and Friday is 5 when using getDay())
      // daysSinceStartDay = 5 - 3, i.e., it's been 2 days since the start day
      var daysSinceStartDay = today.getDay() - this.startDay;
      // add 7 to avoid negative when counting backwards past 0 (Sunday) in the week
      if (daysSinceStartDay < 0) { daysSinceStartDay =+ 7; }
      // Offset by 1 so the query is inclusive
      var startDate = today.getDate() - daysSinceStartDay - 1;
      return new Date( today.setDate(startDate) );
    },

    // Return the end date by moving forward one week
    getEndDate: function() {
      var startDate = this.getStartDate(),
          daysInAWeek = 7,
          // Offset by 1 so the query is inclusive
          endDate = startDate.getDate() + daysInAWeek + 1;
      return new Date( startDate.setDate(endDate) );
    },

    getDateQuery: function(d) {
      return ( d.getFullYear() + "-" + ( d.getMonth() + 1 ) + "-" + d.getDate() );
    },

    getStartDateQuery: function() {
      return this.getDateQuery( this.getStartDate() );
    },

    getEndDateQuery: function() {
      return this.getDateQuery( this.getEndDate() );
    }
  };
}());
