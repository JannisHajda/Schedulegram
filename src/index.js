const Schedulegram = require("./core/schedulegram");

(async () => {

  let posts = [
    {
      account: "For which account do you want to schedule the post?",
      description: "Enter your description here",
      file: "Enter your img-src here.",
      release: {
        date: "28.11.2020",
        time: "18:15"
      }
    }
  ]

  const schedulegram = new Schedulegram(
      (email = "ENTER YOUR MAIL"),
      (password = "ENTER YOUR PASSWORD"),
      (multipleAccounts=true),
      (posts=posts)
  );
})();