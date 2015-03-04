##Zendesk solved ticket progress bar

This is an app for [Zendesk](https://www.zendesk.com/). The app displays on the user page and is updated upon page load with the amount of solved tickets for the current workweek. 

When the app is started for the first time, the agent is asked to input their goal for the week (which is saved in local storage). From then on, a progress bar will be shown to the agent, which shows the number of solved (as well as closed) tickets assigned to that agent during that week (Mon thrugh Sun), as compared to their entered goal.

Once the goal is reached, a congratulatory message will display. :D

### Installation

1. Compress all files into a .zip (`zat package` is good for this. [Zendesk Apps Tools](https://support.zendesk.com/hc/en-us/articles/203691236-Installing-and-using-the-Zendesk-apps-tools)).

2. Upload file to `http://[subdomain].zendesk.com/agent/admin/apps/manage`.

3. Profit.

### Caveats and issues

I wrote this when I was learning javascript (don't judge) and haven't touched it much since.

The `dates` function is something I wrote myself and is kind of buggy around the turn of the year, showing incorrect ticket counts. I think I may have fixed it this past year, but I'm not completely sure.

The solved ticket count is generated via a request to the search API, which is updated every few minutes. Thus, the ticket count (and the progress bar itself) may lag behind a ticket or two (or more if you're solving in bulk).

### Pull Requests are welcome!

https://github.com/jpalmieri/zendesk-progress-bar