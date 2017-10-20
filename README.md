⛔️ I AM NOT ACTIVELY DEVELOPING THIS APP ⛔️

However, I'll still review pull requests and keep an eye on issues. 👍

If there's a feature that you'd like to see in this app, please add an [issue](/jpalmieri/zendesk-progress-bar/issues). If you'd like to contribute, please take a look at the issues and find one that is marked "Help Wanted", and submit a PR for that issue.

Also, please note that _this app is not officially supported by Zendesk_. I am a third-party developer who created this app to help my team. Although the app is listed in the Zendesk marketplace, I am not affiliated with Zendesk and (as far as I know) they do not have any plans to develop this app.

Now, with that out of the way, back to our regularly scheduled program...

## Zendesk solved ticket progress bar

This is an app for [Zendesk](https://www.zendesk.com/). The app displays on the user page and is updated upon page load with the amount of solved tickets for the current workweek.

When the app is started for the first time, the agent is asked to input their goal for the week (which is saved in local storage). From then on, a progress bar will be shown to the agent, which shows the number of solved (as well as closed) tickets assigned to that agent during that week (Mon thrugh Sun), as compared to their entered goal.

Once the goal is reached, a congratulatory message will display. :D

### Screenshots

![](https://i.gyazo.com/b459a52d79189e43bf443e7c52ca9e49.png)
![](https://i.gyazo.com/866c7a8c9007652a87056c4c9eacce71.png)
![](https://i.gyazo.com/3347eaab686822a378d704bc661f470a.png)

### Installation

1. Compress all files into a .zip (`zat package` is good for this. [Zendesk Apps Tools](https://support.zendesk.com/hc/en-us/articles/203691236-Installing-and-using-the-Zendesk-apps-tools)).

2. Upload file to `http://[subdomain].zendesk.com/agent/admin/apps/manage`.

3. Optionally, add role restrictions.

### Caveats and issues

The solved ticket count is generated via a request to the search API, which is updated every few minutes. Thus, the ticket count (and the progress bar itself) may lag behind a ticket or two (or more if you're solving in bulk).

### Pull Requests are welcome!

https://github.com/jpalmieri/zendesk-progress-bar
