(function() {

  return {
    events: {
      'app.activated':'getInfo',
      'click #enter-goal-btn': 'enterGoal',
      'click #change-goal-btn':'showGoal'
    },

    requests: {

      solvedTicketInfo: function(assignee, startDate, endDate) {
        return {
          url: '/api/v2/search.json?query=solved>' + startDate + '+solved<' + endDate + assignee + '+type:ticket',
          type: 'GET',
          dataType: 'json'
        };
      }

    },

    showGoal: function() {
      var a = this;
      this.switchTo('enter_goal');
      this.$('input').on('keypress', function (e) {
        if (e.which == 13) {
          e.preventDefault();
          a.enterGoal();
        }
      });
    },

    getLastSunday: function(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? - 7:0);
      return new Date(d.setDate(diff));
    },

    getUpcomingMonday: function(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? 1:8);
      return new Date(d.setDate(diff));
    },

    getDateQuery: function(d) {
      return (d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate());
    },

    getStartDateQuery: function(d) {
      return this.getDateQuery(this.getLastSunday(d));
    },

    getEndDateQuery: function(d) {
      return this.getDateQuery(this.getUpcomingMonday(d));
    },

    getInfo: function() {
      var goal = this.store('goal');
      if (!goal){
        this.showGoal();
      }
      else {
        var assignee = '+assignee:' + this.currentUser().name();
        var today = new Date();

        this.switchTo('loading');

        var request = this.ajax(
          'solvedTicketInfo', assignee,
          this.getStartDateQuery(today), this.getEndDateQuery(today)
        );
        request.done(this.showBar);
        request.fail(this.showError);
      }
    },

    showBar: function(data) {

      var solvedTickets = data.count;
      var weeklyGoal = this.store('goal');
      var template = '';

      if (solvedTickets >= weeklyGoal) {
        template = 'congrats';
      }
      else {
        template = 'prog_bar';
      }

      this.switchTo(template, {
        data: data,
        weeklyGoal: weeklyGoal,
        percentSolved: (data.count / weeklyGoal) * 100
      });
    },

    showError: function() {
      this.switchTo('error');
    },

    enterGoal: function() {
      this.$("#goal").val();
      this.store('goal', this.$("#goal").val());
      this.getInfo();
    }

  };

}());
