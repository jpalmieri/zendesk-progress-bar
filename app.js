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

    dates: function() {
      //get this week's date range, starting with monday and ending with sunday, parse
      var d = new Date();
      var curr_date = d.getDate();
      var curr_month = d.getMonth();
      var curr_year = d.getFullYear();
      var curr_day = d.getDay();
      var monday = null;
      var sunday = null;
      var monday_date = null;
      var monday_month = null;
      var sunday_date = null;
      var sunday_month = null;
      var endDate = null;
      //determines workweek's monday and sunday dates based on current date and day
      if (curr_day === 0) {
        monday = new Date(curr_year, curr_month, curr_date - 6);
        monday_date = monday.getDate();
        monday_month = monday.getMonth() + 1;
        sunday_date = curr_date;
        sunday_month = curr_month + 1;
        }
      else {
        curr_day--;
        monday = new Date(curr_year, curr_month, curr_date - curr_day);
        monday_date = monday.getDate();
        monday_month = monday.getMonth() + 1;
        sunday = new Date(curr_year, curr_month, curr_date - curr_day + 6);
        sunday_date = sunday.getDate();
        sunday_month = sunday.getMonth() + 1;
        }
      if (monday_month == 12 && sunday_month == 1) {
        endDate = (curr_year + 1 + "-" + (sunday_month) + "-" + sunday_date);
      } else {
        endDate = (curr_year + "-" + (sunday_month) + "-" + sunday_date);
      }
      var startDate = (curr_year + "-" + (monday_month) + "-" + monday_date);
      return [startDate, endDate];
    },

    getInfo: function() {
      var goal = this.store('goal');
      if (!goal){
        this.showGoal();
      }
      else {
        var assignee = '+assignee:' + this.currentUser().name();
        var dates = this.dates();

        this.switchTo('loading');

        var request = this.ajax('solvedTicketInfo', assignee, dates[0], dates[1]);
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
        weeklyGoal: weeklyGoal
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